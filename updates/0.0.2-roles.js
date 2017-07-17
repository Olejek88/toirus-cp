
exports.create = { Role: [
    {
        'name': 'Super',
        __ref: 'role_super'
    },
    {
        'name': 'Admin',
        __ref: 'role_admin'
    },
    {
        'name': 'User',
        __ref: 'role_user'
    }
], };

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
];*/
