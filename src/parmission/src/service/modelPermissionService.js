var mongoose = require('mongoose');
const parmissionsModel = require('../model/authUserModel')

const method_flag = {
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    PUT: 'PUT'
}


var db = async () => {
    mongoose.connection.on('open',  async function (ref) {
        console.log('Connected to mongo server.');
        //trying to get collection names
        mongoose.connection.db.listCollections().toArray(async function (err, collectionName) {
            for (var i = 0; i < collectionName.length; i++) {
                console.log(collectionName[i].name); // [{ name: 'dbname.myCollection' }]
                // console.log();
/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          create add permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/
                var add_permission = {
                    title: "add " + collectionName[i].name,
                    model_name: collectionName[i].name,
                    method: method_flag.POST,

                }
                var findAddPermission = await parmissionsModel.find(add_permission);
                if(findAddPermission.length ==0){
                    const createPermission = new parmissionsModel(add_permission);
                    await  createPermission.save()
                    console.log(createPermission);  
                }
/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          end add permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/
//////////////////////////////////  :: NEXT :://////////////////////////////////////////////////////////
/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          create Delete permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/
   var delete_permission = {
              title:"delete_"+collectionName[i].name,
              model_name:collectionName[i].name,
              method:method_flag.DELETE,

          }
          var findDeletePermission = await parmissionsModel.find(delete_permission);
          if(findDeletePermission.length ==0){
            const deletePermission = new parmissionsModel(delete_permission);
            await  deletePermission.save()
        }
/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          create Delete permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/

//////////////////////////////////  :: NEXT :://////////////////////////////////////////////////////////
/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          create Change permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/
   var change_permission = {
             title:"change_"+collectionName[i].name,
              model_name:collectionName[i].name,
              method:method_flag.PUT,

          }
          var findChangePermission = await parmissionsModel.find(change_permission);
          if(findChangePermission.length ==0){
            const changePermission = new parmissionsModel(change_permission);
            await  changePermission.save()
        }

/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          End Change permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/


//////////////////////////////////  :: NEXT :://////////////////////////////////////////////////////////
/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          CREAT VIEW PERMISSION 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/

          var view_permission = {
              title:"view_"+collectionName[i].name,
              model_name:collectionName[i].name,
              method:method_flag.GET,

          }

        var findViewPermission = await parmissionsModel.find(view_permission);
        if(findViewPermission.length ==0){
        const viewPermission = new parmissionsModel(view_permission);
        await  viewPermission.save()
        }

/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
                          End Change permission 
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/


            }

        });
    })
  
}


module.exports = db