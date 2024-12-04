export const ADMIN_ROLE = "SUPER ADMIN";
export const USER_ROLE = "NORMAL USER";
export const INIT_PERMISSION = [

	{

		"name": "Create a User",
		"apiPath": "/api/v1/users",
		"method": "POST",
		"module": "User",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Register a User
	{

		"name": "Get user by Id",
		"apiPath": "/api/v1/users/:id",
		"method": "GET",
		"module": "User",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Get user by Id
	{

		"name": "Update a User",
		"apiPath": "/api/v1/users/:id",
		"method": "PATCH",
		"module": "User",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},
	 //Update a User
	 {

		"name": "Change password",
		"apiPath": "/api/v1/users/change-password",
		"method": "POST",
		"module": "User",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},
	{

		"name": "Soft-delete User by id",
		"apiPath": "/api/v1/users/:id",
		"method": "DELETE",
		"module": "User",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete User by id
	{

		"name": "Fetch User with paginate",
		"apiPath": "/api/v1/users",
		"method": "GET",
		"module": "User",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch User with paginate
	{

		"name": "Create a Room",
		"apiPath": "/api/v1/rooms",
		"method": "POST",
		"module": "Room",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create a Room
	{

		"name": "Update a Room",
		"apiPath": "/api/v1/rooms/:id",
		"method": "PATCH",
		"module": "Room",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update a Room
	{

		"name": "Soft-delete a Room",
		"apiPath": "/api/v1/rooms/:id",
		"method": "DELETE",
		"module": "Room",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete a Room
	{

		"name": "Fetch data Room by Id",
		"apiPath": "/api/v1/rooms/:id",
		"method": "GET",
		"module": "Room",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch data Room by Id

	{

		"name": "Fetch data Room with paginate",
		"apiPath": "/api/v1/rooms",
		"method": "GET",
		"module": "Room",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch data Room with paginate

	{

		"name": "Create a Service",
		"apiPath": "/api/v1/services",
		"method": "POST",
		"module": "Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create a Service
	{

		"name": "Update a Service",
		"apiPath": "/api/v1/services/:id",
		"method": "PATCH",
		"module": "Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update a Service
	{

		"name": "Soft-delete a Service",
		"apiPath": "/api/v1/services/:id",
		"method": "DELETE",
		"module": "Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete a Service
	{

		"name": "Fetch Service by Id",
		"apiPath": "/api/v1/services/:id",
		"method": "GET",
		"module": "Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Service by Id
	{

		"name": "Fetch data Services with paginate",
		"apiPath": "/api/v1/services",
		"method": "GET",
		"module": "Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch data Services with paginate

	{

		"name": "Create a Invoices",
		"apiPath": "/api/v1/invoices",
		"method": "POST",
		"module": "Invoices",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create a Invoices
	{

		"name": "Fetch data invoices with paginate",
		"apiPath": "/api/v1/invoices",
		"method": "GET",
		"module": "Invoices",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch data invoices with paginate
	{

		"name": "Get Invoices by user Id",
		"apiPath": "/api/v1/invoices/by-user",
		"method": "GET",
		"module": "Invoices",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Get Invoices by user Id
	{

		"name": "Soft-delete Invoices",
		"apiPath": "/api/v1/invoices/:id",
		"method": "DELETE",
		"module": "Invoices",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete Invoices
	{

		"name": "Update a Invoices",
		"apiPath": "/api/v1/invoices/:id",
		"method": "PATCH",
		"module": "Invoices",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update a Invoices

	{

		"name": "Create a Contract",
		"apiPath": "/api/v1/contracts",
		"method": "POST",
		"module": "Contract",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create a Contract
	{

		"name": "Update a Contract",
		"apiPath": "/api/v1/contracts/:id",
		"method": "PATCH",
		"module": "Contract",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update a Contract
	{

		"name": "Soft-delete a Contract",
		"apiPath": "/api/v1/contracts/:id",
		"method": "DELETE",
		"module": "Contract",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete a Contract
	{

		"name": "Fetch data Contracts with paginate",
		"apiPath": "/api/v1/contracts",
		"method": "GET",
		"module": "Contract",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch data Contracts with paginate
	{

		"name": "Fetch data Contracts for Tenant",
		"apiPath": "/api/v1/contracts/by-tenant/:id",
		"method": "POST",
		"module": "Contract",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch data Contracts for User with paginate

	{

		"name": "Create a Role",
		"apiPath": "/api/v1/roles",
		"method": "POST",
		"module": "Role",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create a Role
	{

		"name": "Fetch a Role",
		"apiPath": "/api/v1/roles/:id",
		"method": "POST",
		"module": "Role",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Role with id
	{

		"name": "Update Role",
		"apiPath": "/api/v1/roles/:id",
		"method": "PATCH",
		"module": "Role",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update Role
	{

		"name": "Soft Delete Role",
		"apiPath": "/api/v1/roles/:id",
		"method": "DELETE",
		"module": "Role",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete Role
	{

		"name": "Fetch Roles with paginate",
		"apiPath": "/api/v1/roles",
		"method": "GET",
		"module": "Role",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Roles with paginate
	{

		"name": "Create Permission",
		"apiPath": "/api/v1/permissions",
		"method": "POST",
		"module": "Permission",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create Permission
	{

		"name": "Update Permission",
		"apiPath": "/api/v1/permissions/:id",
		"method": "PATCH",
		"module": "Permission",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update Permission
	{

		"name": "Soft Delete Permission",
		"apiPath": "/api/v1/permissions/:id",
		"method": "DELETE",
		"module": "Permission",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Soft-delete Permission
	{

		"name": "Fetch Permissions with paginate",
		"apiPath": "/api/v1/permissions",
		"method": "GET",
		"module": "Permission",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Permission with paginate 
	{

		"name": "Fetch a Permission with id",
		"apiPath": "/api/v1/permissions/:id",
		"method": "POST",
		"module": "Permission",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Permission with id
	{
		"name": "Create Pay",
		"apiPath": "/api/v1/pay",
		"method": "POST",
		"module": "Pay",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},//Create Pay	
	{
		"name": "Update Pay",
		"apiPath": "/api/v1/pay/:id",
		"method": "PATCH",
		"module": "Pay",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Update Pay

	{

		"name": "Soft Delete Pay",
		"apiPath": "/api/v1/pay/:id",
		"method": "DELETE",
		"module": "Pay",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}
	}, //Soft-delete Pay

	{
		"name": "Fetch Permissions with paginate",
		"apiPath": "/api/v1/pay",
		"method": "GET",
		"module": "Pay",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Pay with paginate 

	{

		"name": "Fetch a Pay with id",
		"apiPath": "/api/v1/pay/:id",
		"method": "GET",
		"module": "Pay",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Fetch Pay with id
	{

		"name": "Upload a single Files",
		"apiPath": "/api/v1/files/upload",
		"method": "POST",
		"module": "Files",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},
	{

		"name": "Upload a multiple Files",
		"apiPath": "/api/v1/files/multiple",
		"method": "POST",
		"module": "Files",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},
	{
		"name": "Upload a Image Id Card",
		"apiPath": "/api/v1/files",
		"method": "POST",
		"module": "Files",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},
	{
		"name": "Register a Service for Room",
		"apiPath": "/api/v1/register-service",
		"method": "POST",
		"module": "Register-Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	}, //Create a register Service
	{
		"name": "Update status register service for Room",
		"apiPath": "/api/v1/register-service/:id",
		"method": "PATCH",
		"module": "Register-Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},//Update status register service for Room
	{
		"name": "Fetch a Register Service",
		"apiPath": "/api/v1/register-service/:id",
		"method": "GET",
		"module": "Register-Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},//Fetch a Register Service
	{
		"name": "Fetch register service with paginate!",
		"apiPath": "/api/v1/register-service",
		"method": "GET",
		"module": "Register-Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},//Fetch register service with paginate!
	{
		"name": "Soft-delete register service!",
		"apiPath": "/api/v1/register-service/:id",
		"method": "DELETE",
		"module": "Register-Service",
		"createdBy": {
			"_id": "",
			"email": "admin@gmail.com"
		},
		"isDeleted": false,
		"deletedAt": null,
		"createdAt": "2024-08-17T04:41:40.369Z",
		"updatedAt": "",
		"__v": 0,
		"updatedBy": {}

	},//Soft-delete register service!
]