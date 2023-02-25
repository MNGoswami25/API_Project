require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
var bodyParser=require("body-parser");

//Database
const database=require("./database");
//Initialise express
const booky=express();
booky.use(bodyParser.urlencoded({extended:true}));
booky.use(bodyParser.json());


mongoose.connect(process.env.MONGO_URL,).then(()=>console.log("connection Estabilished"));
/*

Route       /

Description    Get all the books
Acess           PUBLIC
Parameter       None
Methos          GET
*/
booky.get("/",(req,res)=>{
    return res.json({books:database.books});
});

/*

Route       is

Description    Get specific the books
Acess           PUBLIC
Parameter       isbn
Methos          GET
*/
booky.get("/is/:isbn",(req,res)=>{
    const getSpecificBook=database.books.filter(
        (book)=>book.ISBN===req.params.isbn
    );
   if(getSpecificBook.length===0){
    return res.json({error:`No book found for ISBN of ${req.params.isbn}`})
   }
   return res.json({book:getSpecificBook});
});



/*

Route       /c

Description    Get specific the books on category
Acess           PUBLIC
Parameter       category
Methos          GET
*/
booky.get("/c/:category",(req,res)=>{
    const getSpecificBook=database.books.filter(
        (book)=>book.category.includes(req.params.category)
    );
   if(getSpecificBook.length===0){
    return res.json({error:`No book found for ISBN of ${req.params.category}`})
   }
   return res.json({book:getSpecificBook});
});

/*

Route       /l

Description    Get specific the books on language
Acess           PUBLIC
Parameter       language
Methos          GET
*/

booky.get("/l/:language",(req,res)=>{
    const getSpecificBook=database.books.filter(
        (book)=>book.language.includes(req.params.language)
    );
   if(getSpecificBook.length===0){
    return res.json({error:`No book found for ISBN of ${req.params.language}`})
   }
   return res.json({book:getSpecificBook});
});

/*

Route       /author

Description    Get all author
Acess           PUBLIC
Parameter       None
Methos          GET
*/
booky.get("/author",(req,res)=>{
    return res.json({authors:database.author});
});


/*
Route       /author/book/

Description    Get all author 
Acess           PUBLIC
Parameter       isbn
Methos          GET
*/
booky.get("/author/book/:isbn",(req,res)=>{
    const getSpecificAuthor=database.author.filter(
        (author)=>author.books.includes(req.params.isbn)
    );
   if(getSpecificAuthor.length===0){
    return res.json({error:`No Author found for ISBN of ${req.params.isbn}`})
   }
   return res.json({authors:getSpecificAuthor});
});

/*

Route       /publication

Description    Get all publication
Acess           PUBLIC
Parameter       None
Methos          GET
*/
booky.get("/publication",(req,res)=>{
    return res.json({publication:database.publication});
});





//post
/*
Route       /book/new

Description    Add new book
Acess           PUBLIC
Parameter       None
Methos          post
*/
booky.post("/book/new",(req,res)=>{
   const newBook=req.body;
    database.books.push(newBook);
    return res.json({updatedBooks: database.books});
});

/*
Route       /Author/new

Description    Add new Author
Acess           PUBLIC
Parameter       None
Methos          post
*/
booky.post("/author/new",(req,res)=>{
    const newAuthor=req.body;
     database.author.push(newAuthor);
     return res.json({updatedAuthor: database.author});
 });

 /*
Route       /publication/new

Description    Add new publication
Acess           PUBLIC
Parameter       None
Methos          post
*/
booky.post("/publication/new",(req,res)=>{
    const newPublication=req.body;
     database.publication.push(newPublication);
     return res.json({updatedPublication: database.publication});
 });

  /*
Route       /publication/update/book/

Description    update/add/ new publication
Acess           PUBLIC
Parameter       isbn
Methos          put
*/
booky.put("/publication/update/book/:isbn",(req,res)=>{
    //update the publication database
    database.publication.forEach((pub)=>{
        if(pub.id===req.body.pubId){
            return pub.books.push(req.params.isbn);
        }

    });
    //update the book database
    database.books.forEach((book)=>{
        if(book.ISBN===req.params.isbn){
            book.publications=req.body.pubId;
            return;
        }
    });
    return res.json({
        books:database.books,
        publications:database.publication,
        message:"Sucessfully updated publication"
    })
 });


//Delete

/*
Route       /book/delete/

Description    Delete a book
Acess           PUBLIC
Parameter       isbn
Methos          delete
*/
booky.delete("/book/delete/:isbn",(req,res)=>{
    //whichever book does't matches with the isbn just send it to an updated book database array and rest will be filter out
    const updatedBookDatabase=database.books.filter(
        (book)=>book.ISBN!==req.params.isbn
    )
    database.books=updatedBookDatabase;

    return res.json({books:database.books});
 });



/*
Route       /book/delete/author/

Description    Delete an author from a book and vice versa
Acess           PUBLIC
Parameter       isbn,author id
Methos          delete
*/
booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
   //update book database

   database.books.forEach((book)=>{
    if(book.ISBN===req.params.isbn){
        const newAuthorList=book.author.filter(
            (eachAuthor)=>eachAuthor!==parseInt(req.params.authorId)
        );
        book.author=newAuthorList;
        return;
    }
   });

   //update the author database
   database.author.forEach((eachAuthor)=>{
    if(eachAuthor.id===parseInt(req.params.authorId)){
        const newBookList=eachAuthor.books.filter(
            (book)=>book!=req.params.isbn
        );
        eachAuthor.books=newBookList;
        return;
    }
   });
   return res.json({
    book:database.books,
    author:database.author,
    message:"Author was deleted!!!!!"
   });
 });


booky.listen(3000,()=>{
    console.log("Server is up and running");
});

