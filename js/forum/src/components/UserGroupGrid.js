// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import GroupBadge from 'flarum/components/GroupBadge';
import icon from 'flarum/helpers/icon';
import Group from 'flarum/models/Group';
import ItemList from 'flarum/utils/ItemList';

import UserGroupButton from 'squeevee/at-will-groups/components/UserGroupButton';

export default class UserGroupGrid extends Component {
  view() {
    var items = this.items().toArray();

    return (
      <table className="UserGroupGrid">
        <tbody>
          {
            items.length !== 0 ?
              items :
              (
                <td className="AtWillGroups-Message-noGroups">
                  {app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Message-noGroups')}
                </td>
              )
          }
        </tbody>
      </table>
      );
  }

  items() {
    const items = new ItemList();

    var user = app.session.user;
    var userGroups = user.groups()
      && user.groups().map((group) => {
        return group.id();
      });
    var groupPermissions = user.attribute('atWillGroups');

    var groups = app.store.all('groups').forEach((group) => {
      var id = group.id();
      var isMember = userGroups.includes(id);

      if (id === Group.GUEST_ID
        || id === Group.MEMBER_ID)
        return;

      var mayJoin = false;
      var mayLeave = false;

      if (id !== Group.ADMINISTRATOR_ID && groupPermissions) {
        if (!isMember)
          mayJoin = groupPermissions.mayJoin && groupPermissions.mayJoin.includes(id);
        else
          mayLeave = groupPermissions.mayLeave && groupPermissions.mayLeave.includes(id);
      }

      if (!isMember && !mayJoin)
        return;

      items.add('group' + id,
        this.item(group, isMember, mayJoin, mayLeave));
    });

    return items;
  }

  item(group, isMember, mayJoin, mayLeave) {
    return (
        <tr className="AtWillGroups-group">
          <td className="AtWillGroups-memberIcon">
            {isMember ? (
              <span title={app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Message-isMember')}>
                {icon('check-circle')}
              </span>
            ): null}
          </td>
          <td>
            {GroupBadge.component({
              group,
              className: 'Group-icon',
              label: null
            })}
          </td>
          <td>
            <span className="AttWillGroups-groupName" title={group.attribute('namePlural')}>
              {group.attribute('namePlural')}
            </span>
          </td>
          <td>
            {UserGroupButton.component({
              groupId: group.id(),
              isMember: isMember,
              mayJoin: mayJoin,
              mayLeave: mayLeave
            })}
          </td>
        </tr>
    );
  }
}
