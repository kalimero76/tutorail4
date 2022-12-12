const express = require( "express" );
const mysql = require( 'mysql' );
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );

const app = express();
app.use( cors() );
app.use( bodyParser.json() );

const port = process.env.PORT || 5002


// addData()
// app.use(cors())

//middleware
app.use( express.json() )
// app.disable('view cache');

//router 
app.get( "/", ( req, res ) => {
    res.send( 'hw' );
} )


app.listen( port, () => {
    console.log( 'server started' );
} )




// connection to the database
try {
  var conn = mysql.createConnection( {
    host: "aws-eu-west-2.connect.psdb.cloud",
    user: "kjfuyygtxx3rvwwzpezj",
    password: "pscale_pw_DEtaw79xMnWBTk3l3xCwGZJyQcPdwmM4TIa8ZkKTO4k",
    database: "gestionproduits",
    ssl: {
      rejectUnauthorized: true
    }
  } );

  conn.connect( function ( err ) {
    if ( err ) throw err;
    console.log( "Succesfully connected to PlanetScale!" );

    //process.exit( 0 )
  } );
} catch ( err ) {
  console.log( 'Connection error', err )

}


// get all products
try {
  app.get( '/getAllProducts', ( request, response ) => {
    var sqlStr = 'SELECT * FROM Produit'
    conn.query( sqlStr, function ( err, result, fields ) {
      if ( err ) throw err
      response.status( 200 ).json( result );
      // console.log( JSON.stringify( result ) );

    } )
  } )
}
catch ( err ) {
  console.error( err )

}


// Get a product by ID
try {
  app.get( '/getProduct/:id', ( request, response ) => {
    const id = request.params.id;
    var sqlStr = "SELECT * FROM Produit where id=?";
    conn.query( sqlStr, id, function ( err, result, fields ) {
      if ( err ) throw err
      console.log( JSON.stringify( result ) );

      if ( result.length > 0 ) {

        response.status( 200 ).json( {
          message: "produit(s) trouvé(s)",
          data: result[0]
        } );
      }
      else {
        console.log( "Produit non trouvé" );
        response.status( 200 ).json( {
          message: "Aucun produit trouvé",
          data: {}
        } );
      }

    } )
  } )
}
catch ( err ) {
  console.error( err )
}



//Modifier produit
try {
  app.post( "/updateProduct/:id", ( request, response ) => {
    const id = request.params.id;
    const produit = request.body;

    //conn.query( "update Produit set description= '" + produit.description + "', image='" + produit.image + "',prix=" + produit.prix + ",details='" + produit.details + "' where id=" + id, function ( err, result, fields )
    var sql = "update Produit set description= ? , image= ?  , prix=?,details= ? where id=?"
    conn.query( sql, [produit.description, produit.image, produit.prix, produit.details, id], function ( err, result, fields ) {
      if ( err ) throw err;
      response.status( 200 ).send( "Produit modifié" );
    } );
    // response.status( 200 ).json( response);
    // console.log( JSON.stringify( result ) );

  } )
}
catch ( err ) {
  console.error( err )

}




// Supprimer produit
try {
  app.post( "/deleteProduct/:id", ( request, response ) => {
    const id = request.params.id;
    const produit = request.body;


    var sqlStr = "DELETE FROM Produit where id= ?"
    conn.query( sqlStr, id, function ( err, result, fields ) {
      if ( err ) throw err;
      response.status( 200 ).send( "Produit supprimé" );
    } );
    // response.status( 200 ).json( response);
    // console.log( JSON.stringify( result ) );

  } )
}
catch ( err ) {
  console.error( err )

}


// Add new  produit
try {
  app.post( "/createProduct", ( request, response ) => {

    const produit = request.body;

    //conn.query( "update Produit set description= '" + produit.description + "', image='" + produit.image + "',prix=" + produit.prix + ",details='" + produit.details + "' where id=" + id, function ( err, result, fields )
    var sql = "INSERT INTO Produit values (null,?,?,?,? )"
    conn.query( sql, [produit.description, produit.image, produit.prix, produit.details], function ( err, result, fields ) {
      if ( err ) throw err;
      response.status( 200 ).send( "Produit ajouté" );
    } );
    // response.status( 200 ).json( response);
    // console.log( JSON.stringify( result ) );

  } )
}
catch ( err ) {
  console.error( err )

}


