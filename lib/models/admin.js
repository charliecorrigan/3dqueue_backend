var pg           = require('pg');

var conString = process.env.DATABASE_URL;

var client = new pg.Client(conString);




function Admin(){
    this.u_id = 0;
    this.username = "";
    this.password= ""; //need to declare the things that i want to be remembered for each user in the database
    this.created_at = "";
    this.save = function(callback) {
        var conString = process.env.DATABASE_URL;

        var client = new pg.Client(conString);
        client.connect();

        console.log(this.username +' will be saved');

            client.query('INSERT INTO admins(username, password, created_at) VALUES($1, $2, $3)', [this.username, this.password, new Date], function (err, result) {
                if(err){
                    console.log(err);
                    return console.error('error running query', err);
                }
                console.log(result.rows);
                //console.log(this.username);
            });
            client.query('SELECT * FROM admins ORDER BY u_id desc limit 1', null, function(err, result){

                if(err){
                    return callback(null);
                }
                //if no rows were returned from query, then new user
                if (result.rows.length > 0){
                    console.log(result.rows[0] + ' is found!');
                    var admin = new Admin();
                    admin.username= result.rows[0]['username'];
                    admin.password = result.rows[0]['password'];
                    admin.u_id = result.rows[0]['u_id'];
                    console.log(admin.username);
                    client.end();
                    return callback(admin);
                }
            });



            //whenever we call 'save function' to object USER we call the insert query which will save it into the database.
        //});
    };
        //User.connect

    //this.findById = function(u_id, callback){
    //    console.log("we are in findbyid");
    //    var user = new User();
    //    user.email= 'carol';
    //    user.password='gah';
    //    console.log(user);
    //
    //    return callback(null, user);
    //
    //};


}

Admin.findOne = function(username, callback){
    var conString = process.env.DATABASE_URL;
    var client = new pg.Client(conString);

    var isNotAvailable = false; //we are assuming the username is taking
    //var username = this.username;
    //var rowresult = false;
    console.log(username + ' is in the findOne function test');
    //check if there is a user available for this username;
    client.connect();
    //client.connect(function(err) {
    ////    //console.log(this.photo);
    //    console.log(username);
    //    if (err) {
    //        return console.error('could not connect to postgres', err);
    //    }

    client.query("SELECT * from admins where username=$1", [username], function(err, result){
        if(err){
            return callback(err, isNotAvailable, this);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0){
            isNotAvailable = true; // update the user for return in callback
            ///username = username;
            //password = result.rows[0].password;
            console.log(username + ' is am not available!');
        }
        else{
            isNotAvailable = false;
            //username = username;
            console.log(username + ' is available');
        }
        //the callback has 3 parameters:
        // parameter err: false if there is no error
        //parameter isNotAvailable: whether the username is available or not
        // parameter this: the User object;

        client.end();
        return callback(false, isNotAvailable, this);


    });
//});
};

Admin.findById = function(id, callback){
    console.log("we are in findbyid");
    var conString = process.env.DATABASE_URL;
    var client = new pg.Client(conString);

    client.connect();
    client.query("SELECT * from users where u_id=$1", [id], function(err, result){

        if(err){
            return callback(err, null);
        }
        //if no rows were returned from query, then new user
        if (result.rows.length > 0){
            console.log(result.rows[0] + ' is found!');
            var user = new User();
            user.username= result.rows[0]['username'];
            user.password = result.rows[0]['password'];
            user.u_id = result.rows[0]['u_id'];
            console.log(user.username);
            return callback(null, user);
        }
    });
};

//User.connect = function(callback){
//    return callback (false);
//};

//User.save = function(callback){
//    return callback (false);
//};

module.exports = Admin;