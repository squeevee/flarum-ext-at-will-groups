// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

import app from 'flarum/app';
import SettingDropdown from 'flarum/components/SettingDropdown';
import PermissionGrid from 'flarum/components/PermissionGrid';
import { extend } from 'flarum/extend';
import { override } from 'flarum/extend';
import Group from 'flarum/models/Group';
import ItemList from 'flarum/utils/ItemList';

function atWillGroupsItems() {
  const items = new ItemList();

  app.store.all('groups').forEach((group) => {
    var id = group.id();

    if (id === Group.ADMINISTRATOR_ID
      || id === Group.GUEST_ID
      || id === Group.MEMBER_ID)
      return;

    items.add('at-will-group-' + id, {
      icon: group.attribute('icon') || 'user-circle-o',
      label: group.attribute('namePlural'),
      setting: () => SettingDropdown.component({
        key: 'atWillGroup_' + id,
        options: [
          {
            value: 'none',
            label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.none')
          },
          {
            value: 'join-and-leave',
            label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.join-and-leave')
          },
          {
            value: 'join-only',
            label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.join-only')
          },
          {
            value: 'leave-only',
            label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.leave-only')
          }
        ]
      })
    });
  });

  return items;
}

app.initializers.add('squeevee-at-will-groups', () => {

  extend(PermissionGrid.prototype, 'permissionItems', (items) => {
    items.add('at-will-groups', {
      label: app.translator.trans('squeevee-at-will-groups.admin.main.permissionItems-label'),
      children: atWillGroupsItems().toArray()
    }, 0);
  });

  override(PermissionGrid.prototype, 'view', function (_view) {
    //Unlike other sections of the permissions page, ours can be changed
    //on the fly by controls that are *also on this page*. We'll want our
    //information to be up-to-date with every m.redraw()
    this.permissions.find((item) => item.itemName === 'at-will-groups').children = atWillGroupsItems().toArray();
    return _view();
  });

});
