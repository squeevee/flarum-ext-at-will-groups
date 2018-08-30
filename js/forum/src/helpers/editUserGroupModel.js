// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

export default function editUserGroupModel(user, join, id) {
  if (!user || !user.data || !user.data.relationships)
    throw new Error('Invalid user model');

  var relationships = user.data.relationships;
  if (join)
  {
    relationships.groups.data.push({
      type: 'groups',
      id: id
    });
  }
  else
  {
    relationships.groups.data = relationships.groups.data.filter((g) => {
      return g.id != id;
    });
  }
}
