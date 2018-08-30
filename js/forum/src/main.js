// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

import app from 'flarum/app';
import FieldSet from 'flarum/components/FieldSet';
import SettingsPage from 'flarum/components/SettingsPage';
import { extend } from 'flarum/extend';
import Model from 'flarum/Model';
import User from 'flarum/models/User';

import UserGroupGrid from 'squeevee/at-will-groups/components/UserGroupGrid';

app.initializers.add('squeevee-at-will-groups', () => {

  User.prototype.groupPermissions = Model.hasMany('groupPermissions');

  extend(SettingsPage.prototype, 'settingsItems', function(items) {
    items.add('groups',
      FieldSet.component({
        label: app.translator.trans('squeevee-at-will-groups.forum.main.FieldSet-groups'),
         className: 'Settings-groups',
        children: [UserGroupGrid.component()]
      })
    );
  });
});
