const db = firebase.firestore();
var storageRef = firebase.storage().ref();
function addprod(){
 var furnname = document.getElementById("furnname").value;
    var furnprice = document.getElementById("furnprice").value;
    var furnimage = document.getElementById("furnimg");
    var furdes = document.getElementById("furndes").value;
    var furncategory = document.getElementById("products").value;
    var furnar = document.getElementById("furnar");
    var SubmitButton = document.getElementById("SubmitButton");
    // Add price to database as integer value
    var furnpriceint = parseInt(furnprice);

    if(furnname == "" || furnprice == "" || furdes == "" || furncategory == "" || furnar == "" || furnimage.files.length == 0 || furnar.files.length == 0){
        alert("Please fill all the fields");
    }else{
        const docRef = db.collection(furncategory).doc(furnname);
        docRef.get().then((doc) => {
            if(doc.exists){
                alert("Product already exists");
            }else{
                var furnimgfile = furnimage.files[0];
                var furnarfile = furnar.files[0];
                var furnimgref = storageRef.child(furncategory + "/" + furnname + "/" + furnimgfile.name).put(furnimgfile);
                var furnarref = storageRef.child(furncategory + "/" + furnname + "/" + furnarfile.name).put(furnarfile);

                furnimgref.on('state_changed', function(snapshot){
                    SubmitButton.innerHTML = "Uploading image...";
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            SubmitButton.innerHTML = "Uploading image...";
                            console.log('Upload is running');
                            break;
                    }
                }
                , function(error) {
                    // Handle unsuccessful uploads
                }
                , function() {
                    SubmitButton.innerHTML = "Uploading Model...";
                    // Handle successful uploads on complete
                    furnimgref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                       
                        console.log('File available at', downloadURL);
                        furnarref.on('state_changed', function(snapshot){
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                                case firebase.storage.TaskState.PAUSED: // or 'paused'
                                    console.log('Upload is paused');
                                    break;
                                case firebase.storage.TaskState.RUNNING: // or 'running'
                                SubmitButton.innerHTML = "Uploading Model...";
                                    console.log('Upload is running');
                                    break;
                            }
                        }
                        , function(error) {
                            // Handle unsuccessful uploads
                        }
                        , function() {
                            SubmitButton.innerHTML = "Upload Successful";
                            // Handle successful uploads on complete
                            furnarref.snapshot.ref.getDownloadURL().then(function(downloadURLar) {
                                console.log('File available at', downloadURL);
                                docRef.set({
                                    name: furnname,
                                    price: furnpriceint,
                                    img_url: downloadURL,
                                    description: furdes,
                                    name2: downloadURLar,
                                    type: furncategory
                                }).then(function(){
                                    alert("Product added successfully");
                                }).catch(function(error){
                                    alert("Error adding product");
                                });
                            });
                        });
                    });
                }
                );
            }
        }).catch(function(error){
            alert("Error adding product");
        }
        );
    }
}
