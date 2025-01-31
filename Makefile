# Batch process for creation of all users for a default DOVU process
create-all-users:
	./dovu create-user --role standard_registry --owner
	./dovu create-user --role supplier
	./dovu create-user --role verifier
