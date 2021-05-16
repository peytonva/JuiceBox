const {
    client,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getPostById,
    getPostsByTagName,
    createTags,
    createPostTag,
    addTagsToPost,
  } = require("./index");
  
  async function dropTables() {
    try {
      console.log("Dropping tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
  
      console.log("Tables dropped!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }
  
  async function createTables() {
    try {
      console.log("Building tables...");
  
      await client.query(`
          CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
          );
          CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title varchar(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
          );
          CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
          );
          CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE("postId", "tagId")
          );
        `);
  
      console.log("Tables built!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }
  
  async function createInitialUsers() {
    try {
      console.log("Creating users...");
  
      const albert = await createUser({
        username: "albert",
        password: "bertie99",
        name: "albertie",
        location: "Alberta",
      });
  
      const sandra = await createUser({
        username: "sandra",
        password: "2sandy4me",
        name: "Sandace",
        location: "Sandy Shores",
      });
  
      const glamgal = await createUser({
        username: "glamgal",
        password: "soglam",
        name: "Gorber",
        location: "Glooptown",
      });
  
      console.log("Users created!");
    } catch (error) {
      console.error("Error creating users!");
      throw error;
    }
  }
  
  async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal] = await getAllUsers();
  
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content:
          "This is my first post. I hope I love writing blogs as much as I love writing them. Bloggers!",
        tags: ["#happy", "#youcandoanything"],
      });
  
      await createPost({
        authorId: sandra.id,
        title: "t3h PeNgU1N oF d00m",
        content:
          "hi every1 im new!!!!!!! *holds up spork* my name is sandy but u can call me t3h PeNgU1N oF d00m!!!!!!!!",
        tags: ["#happy", "#worst-day-ever"],
      });
  
      await createPost({
        authorId: glamgal.id,
        title: "glamgal",
        content: "glugh glur glucth glor glurk O_o",
        tags: ["#happy", "#youcandoanything", "#canmandoeverything"],
      });
    } catch (error) {
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialPosts();
    } catch (error) {
      throw error;
    }
  }
  
  async function testDB() {
    try {
      console.log("Testing database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "alberto",
        location: "Albertstown",
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content",
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);
  
      console.log("Calling getPostById with 1");
      const post1 = await getPostById(1);
      console.log("Result:", post1);
  
      console.log("Calling updatePost on posts[1], only updating tags");
      const updatePostTagsResult = await updatePost(posts[1].id, {
        tags: ["#youcandoanything", "#redfish", "#bluefish"],
      });
      console.log("Result:", updatePostTagsResult);
  
      console.log("Calling getPostsByTagName with #happy");
      const postsWithHappy = await getPostsByTagName("#happy");
      console.log("Result:", postsWithHappy);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());