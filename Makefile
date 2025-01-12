
create-user:
	node createUser.js "$(role)"

create-all-users:
	make create-user role=standard_registry
	make create-user role=supplier
	make create-user role=verifier

create-workflow-instance:


#drop:
#	php artisan db:wipe
#
#test_users:
#	php artisan db:seed --class=UserSeeder
#
#recreate: drop create test_users
#
#import_acm: recreate
#	php artisan import:ACM0001
#
#recreate_forge:
#	php8.3 artisan db:wipe
#	php8.3 artisan migrate
#	php8.3 artisan db:seed
#	php8.3 artisan db:seed --class=UserSeeder
