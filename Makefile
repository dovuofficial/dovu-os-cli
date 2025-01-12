
create-user:
	node createUser.js "$(role)"

create-all-users:
	make create-user role=standard_registry
	make create-user role=supplier
	make create-user role=verifier