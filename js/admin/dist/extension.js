'use strict';

System.register('squeevee/at-will-groups/main', ['flarum/app', 'flarum/components/SettingDropdown', 'flarum/components/PermissionGrid', 'flarum/extend', 'flarum/models/Group', 'flarum/utils/ItemList'], function (_export, _context) {
  "use strict";

  var app, SettingDropdown, PermissionGrid, extend, override, Group, ItemList;


  function atWillGroupsItems() {
    var items = new ItemList();

    app.store.all('groups').forEach(function (group) {
      var id = group.id();

      if (id === Group.ADMINISTRATOR_ID || id === Group.GUEST_ID || id === Group.MEMBER_ID) return;

      items.add('at-will-group-' + id, {
        icon: group.attribute('icon') || 'user-circle-o',
        label: group.attribute('namePlural'),
        setting: function setting() {
          return SettingDropdown.component({
            key: 'atWillGroup_' + id,
            options: [{
              value: 'none',
              label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.none')
            }, {
              value: 'join-and-leave',
              label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.join-and-leave')
            }, {
              value: 'join-only',
              label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.join-only')
            }, {
              value: 'leave-only',
              label: app.translator.trans('squeevee-at-will-groups.admin.main.atWillGroupItems-options.leave-only')
            }]
          });
        }
      });
    });

    return items;
  } // 'At-Will Groups' source code
  // (c) 2018 Ellie Hawk "@squeevee"

  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsSettingDropdown) {
      SettingDropdown = _flarumComponentsSettingDropdown.default;
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
      override = _flarumExtend.override;
    }, function (_flarumModelsGroup) {
      Group = _flarumModelsGroup.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }],
    execute: function () {
      app.initializers.add('squeevee-at-will-groups', function () {

        extend(PermissionGrid.prototype, 'permissionItems', function (items) {
          items.add('at-will-groups', {
            label: app.translator.trans('squeevee-at-will-groups.admin.main.permissionItems-label'),
            children: atWillGroupsItems().toArray()
          }, 0);
        });

        override(PermissionGrid.prototype, 'view', function (_view) {
          //Unlike other sections of the permissions page, ours can be changed
          //on the fly by controls that are *also on this page*. We'll want our
          //information to be up-to-date with every m.redraw()
          this.permissions.find(function (item) {
            return item.itemName === 'at-will-groups';
          }).children = atWillGroupsItems().toArray();
          return _view();
        });
      });
    }
  };
});