'use strict';

System.register('squeevee/at-will-groups/components/UserGroupButton', ['flarum/app', 'flarum/Component', 'flarum/components/Button', 'squeevee/at-will-groups/helpers/editUserGroupModel'], function (_export, _context) {
  "use strict";

  var app, Component, Button, editUserGroupModel, UserGroupButton;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_squeeveeAtWillGroupsHelpersEditUserGroupModel) {
      editUserGroupModel = _squeeveeAtWillGroupsHelpersEditUserGroupModel.default;
    }],
    execute: function () {
      UserGroupButton = function (_Button) {
        babelHelpers.inherits(UserGroupButton, _Button);

        function UserGroupButton() {
          babelHelpers.classCallCheck(this, UserGroupButton);
          return babelHelpers.possibleConstructorReturn(this, (UserGroupButton.__proto__ || Object.getPrototypeOf(UserGroupButton)).apply(this, arguments));
        }

        babelHelpers.createClass(UserGroupButton, [{
          key: 'view',
          value: function view() {
            var _this2 = this;

            this.props.className = 'Button';
            this.props.onclick = function () {
              _this2.toggle();
            };
            this.props.loading = this.loading;

            if (!this.props.isMember && this.props.mayJoin) {
              this.props.children = app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Button-join');
            } else if (this.props.isMember) {
              if (this.props.mayLeave) {
                this.props.children = app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Button-leave');
              } else {
                this.props.children = app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Button-cannotLeave');
                this.props.onclick = undefined;
                this.props.disabled = true;
              }
            }

            //UserGroupGrid rows are not shown for groups of which the user is not a member, and may not join.

            return babelHelpers.get(UserGroupButton.prototype.__proto__ || Object.getPrototypeOf(UserGroupButton.prototype), 'view', this).call(this);
          }
        }, {
          key: 'toggle',
          value: function toggle() {
            var _this3 = this;

            var join = !this.props.isMember;

            this.loading = true;
            m.redraw();

            app.request({
              method: 'PATCH',
              url: app.forum.attribute('apiUrl') + '/squeevee/at-will-groups',
              data: {
                'join': join ? [this.props.groupId] : [],
                'leave': !join ? [this.props.groupId] : []
              }
            }).then(function () {
              //'groups' is a property of the User model, which means it should typically
              //be updated via the 'User.save()' method. However, this was not practical
              //on the server side because of permissions issues: hence this new API.
              //
              //This leaves us without a natural way of updating the local model, so this
              //helper function does that for us in a slightly hack-ish way.
              editUserGroupModel(app.session.user, join, _this3.props.groupId);

              _this3.props.isMember = !_this3.props.isMember;
              _this3.loading = false;
              m.redraw();
            });
          }
        }]);
        return UserGroupButton;
      }(Button);

      _export('default', UserGroupButton);
    }
  };
});;
'use strict';

System.register('squeevee/at-will-groups/components/UserGroupGrid', ['flarum/app', 'flarum/Component', 'flarum/components/Button', 'flarum/components/GroupBadge', 'flarum/helpers/icon', 'flarum/models/Group', 'flarum/utils/ItemList', 'squeevee/at-will-groups/components/UserGroupButton'], function (_export, _context) {
  "use strict";

  var app, Component, Button, GroupBadge, icon, Group, ItemList, UserGroupButton, UserGroupGrid;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponent) {
      Component = _flarumComponent.default;
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton.default;
    }, function (_flarumComponentsGroupBadge) {
      GroupBadge = _flarumComponentsGroupBadge.default;
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon.default;
    }, function (_flarumModelsGroup) {
      Group = _flarumModelsGroup.default;
    }, function (_flarumUtilsItemList) {
      ItemList = _flarumUtilsItemList.default;
    }, function (_squeeveeAtWillGroupsComponentsUserGroupButton) {
      UserGroupButton = _squeeveeAtWillGroupsComponentsUserGroupButton.default;
    }],
    execute: function () {
      UserGroupGrid = function (_Component) {
        babelHelpers.inherits(UserGroupGrid, _Component);

        function UserGroupGrid() {
          babelHelpers.classCallCheck(this, UserGroupGrid);
          return babelHelpers.possibleConstructorReturn(this, (UserGroupGrid.__proto__ || Object.getPrototypeOf(UserGroupGrid)).apply(this, arguments));
        }

        babelHelpers.createClass(UserGroupGrid, [{
          key: 'view',
          value: function view() {
            var items = this.items().toArray();

            return m(
              'table',
              { className: 'UserGroupGrid' },
              m(
                'tbody',
                null,
                items.length !== 0 ? items : m(
                  'td',
                  { className: 'AtWillGroups-Message-noGroups' },
                  app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Message-noGroups')
                )
              )
            );
          }
        }, {
          key: 'items',
          value: function items() {
            var _this2 = this;

            var items = new ItemList();

            var user = app.session.user;
            var userGroups = user.groups() && user.groups().map(function (group) {
              return group.id();
            });
            var groupPermissions = user.attribute('atWillGroups');

            var groups = app.store.all('groups').forEach(function (group) {
              var id = group.id();
              var isMember = userGroups.includes(id);

              if (id === Group.GUEST_ID || id === Group.MEMBER_ID) return;

              var mayJoin = false;
              var mayLeave = false;

              if (id !== Group.ADMINISTRATOR_ID && groupPermissions) {
                if (!isMember) mayJoin = groupPermissions.mayJoin && groupPermissions.mayJoin.includes(id);else mayLeave = groupPermissions.mayLeave && groupPermissions.mayLeave.includes(id);
              }

              if (!isMember && !mayJoin) return;

              items.add('group' + id, _this2.item(group, isMember, mayJoin, mayLeave));
            });

            return items;
          }
        }, {
          key: 'item',
          value: function item(group, isMember, mayJoin, mayLeave) {
            return m(
              'tr',
              { className: 'AtWillGroups-group' },
              m(
                'td',
                { className: 'AtWillGroups-memberIcon' },
                isMember ? m(
                  'span',
                  { title: app.translator.trans('squeevee-at-will-groups.forum.components.UserGroupGrid.Message-isMember') },
                  icon('check-circle')
                ) : null
              ),
              m(
                'td',
                null,
                GroupBadge.component({
                  group: group,
                  className: 'Group-icon',
                  label: null
                })
              ),
              m(
                'td',
                null,
                m(
                  'span',
                  { className: 'AttWillGroups-groupName', title: group.attribute('namePlural') },
                  group.attribute('namePlural')
                )
              ),
              m(
                'td',
                null,
                UserGroupButton.component({
                  groupId: group.id(),
                  isMember: isMember,
                  mayJoin: mayJoin,
                  mayLeave: mayLeave
                })
              )
            );
          }
        }]);
        return UserGroupGrid;
      }(Component);

      _export('default', UserGroupGrid);
    }
  };
});;
'use strict';

System.register('squeevee/at-will-groups/helpers/editUserGroupModel', [], function (_export, _context) {
  "use strict";

  function editUserGroupModel(user, join, id) {
    if (!user || !user.data || !user.data.relationships) throw new Error('Invalid user model');

    var relationships = user.data.relationships;
    if (join) {
      relationships.groups.data.push({
        type: 'groups',
        id: id
      });
    } else {
      relationships.groups.data = relationships.groups.data.filter(function (g) {
        return g.id != id;
      });
    }
  }

  _export('default', editUserGroupModel);

  return {
    setters: [],
    execute: function () {}
  };
});;
'use strict';

System.register('squeevee/at-will-groups/main', ['flarum/app', 'flarum/components/FieldSet', 'flarum/components/SettingsPage', 'flarum/extend', 'flarum/Model', 'flarum/models/User', 'squeevee/at-will-groups/components/UserGroupGrid'], function (_export, _context) {
  "use strict";

  var app, FieldSet, SettingsPage, extend, Model, User, UserGroupGrid;
  return {
    setters: [function (_flarumApp) {
      app = _flarumApp.default;
    }, function (_flarumComponentsFieldSet) {
      FieldSet = _flarumComponentsFieldSet.default;
    }, function (_flarumComponentsSettingsPage) {
      SettingsPage = _flarumComponentsSettingsPage.default;
    }, function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumModel) {
      Model = _flarumModel.default;
    }, function (_flarumModelsUser) {
      User = _flarumModelsUser.default;
    }, function (_squeeveeAtWillGroupsComponentsUserGroupGrid) {
      UserGroupGrid = _squeeveeAtWillGroupsComponentsUserGroupGrid.default;
    }],
    execute: function () {

      app.initializers.add('squeevee-at-will-groups', function () {

        User.prototype.groupPermissions = Model.hasMany('groupPermissions');

        extend(SettingsPage.prototype, 'settingsItems', function (items) {
          items.add('groups', FieldSet.component({
            label: app.translator.trans('squeevee-at-will-groups.forum.main.FieldSet-groups'),
            className: 'Settings-groups',
            children: [UserGroupGrid.component()]
          }));
        });
      }); // 'At-Will Groups' source code
      // (c) 2018 Ellie Hawk "@squeevee"
    }
  };
});