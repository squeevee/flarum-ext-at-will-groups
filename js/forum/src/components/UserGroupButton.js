// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';

import editUserGroupModel from 'squeevee/at-will-groups/helpers/editUserGroupModel';

export default class UserGroupButton extends Button {

  view() {
    this.props.className = 'Button';
    this.props.onclick = () => {this.toggle()};
    this.props.loading = this.loading;

    if (!this.props.isMember && this.props.mayJoin)
    {
      this.props.children = app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Button-join');
    }
    else if (this.props.isMember)
    {
      if (this.props.mayLeave)
      {
        this.props.children = app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Button-leave');
      }
      else
      {
        this.props.children = app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Button-cannotLeave');
        this.props.onclick = undefined;
        this.props.disabled = true;
      }
    }

    //UserGroupGrid rows are not shown for groups of which the user is not a member, and may not join.

    return super.view();
  }

  toggle() {
    const join = !this.props.isMember;

    this.loading = true;
    m.redraw();

    app.request({
      method: 'PATCH',
      url: app.forum.attribute('apiUrl') + '/squeevee/at-will-groups',
      data:
      {
        'join' : (join ? [this.props.groupId] : []),
        'leave' : (!join ? [this.props.groupId] : [])
      }
    }).then(() => {
      //'groups' is a property of the User model, which means it should typically
      //be updated via the 'User.save()' method. However, this was not practical
      //on the server side because of permissions issues: hence this new API.
      //
      //This leaves us without a natural way of updating the local model, so this
      //helper function does that for us in a slightly hack-ish way.
      editUserGroupModel(app.session.user, join, this.props.groupId);

      this.props.isMember = !this.props.isMember;
      this.loading = false;
      m.redraw();
    });
  }
}
