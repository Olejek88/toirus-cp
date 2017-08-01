exports.create = { Permission: [
  {
    name: 'Role List Permissions',
    listName: 'Role',
    create: ['role_super'],
    read: ['role_super'],
    update: ['role_super'],
    delete: ['role_super'],
    __ref: 'permission_role',
  },
  {
    name: 'User List Permissions',
    listName: 'User',
    create: ['role_super'],
    read: ['role_super'],
    update: ['role_super'],
    delete: ['role_super'],
    __ref: 'permission_user',
  },
  {
    name: 'Permission List Permissions',
    listName: 'Permission',
    create: ['role_super'],
    read: ['role_super'],
    update: ['role_super'],
    delete: ['role_super'],
    __ref: 'permission_permission',
  },
] };

/*
exports.User = [
    {
        'name.first': 'Admin',
        'name.last': '',
        'name.full': 'Admin',
        email: keystoneui.get('admin email'),
        password: keystoneui.get('admin password'),
        isAdmin: true,
        roles: ['role_super'],
        __ref: 'admin_user'
    }
]; */
