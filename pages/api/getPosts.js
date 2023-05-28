import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";


export default withApiAuthRequired(async function handler(req, res){
   // jak jest async to "musi" być await, a jak await to i try() catch() no bo nie wiesz co inneego serwera słychać.
try {
    const {user: {sub}} = await getSession(req, res);
    //tu importujesz funkcje GetSession() Z pliku w paczce "auth0/nextjs-auth0",
    // tą funkcją obiekt znajdujący się w "zdestruktyryzowanej" zmiennej 'user'
    // w niej jest jest eigentschaft 'sub' którą przysłał API-autha0, a wnim masz właściwości  (ale jak te API zobaczyć? ////AKORDEON

    const client = await clientPromise;
    //tu importujemy do stałej "client" zmienną clientPromise z pliku lib/mongodb.js,
    // Vendor od pakietu do bazy danych mongo go swtworzył.

    const db = client.db('BlogStandard');
    // w tej stałej db zamkniemy nasz taki DB-Connector do bazy danych o nazwie 'BlogStandard'

    const userProfile = await db.collection('users').findOne({
        auth0Id: sub
    });
    // w tej stałej userProfile zamkniemy wynik zapytania do kolekcji users bazy danych BlogSandard,
    // i znajdź funkcją findOne() w tej kolekcji bazy danych wpis,
    // w którym zawartość indexu "Auth0Id" w Json'ie in Databe jest równa dla sub {user: {sub}} z obiektu user z funkcji getSession(req, res);

    const {lastPostDate} = req.body;
    // tu "?Destrukturyzujemy?" lastPostDate, czym jest req.body?

    const posts = await db.collection('posts').find({
        userId: userProfile._id,
        created: {$lt: new Date(lastPostDate)}
    })
        .limit(5)
        .sort({created: -1})
        .toArray();

    res.status(200).json({ posts });
    return;

}catch(e){
}
})
