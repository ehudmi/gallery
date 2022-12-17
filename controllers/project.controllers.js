const {
  _readDb,
  _readDbNotNull,
  _readDb_Limited,
  _countRows,
  _searchDb,
  _insertDb,
  // _updateDb,
  _deleteDb,
  _get2TabJoinData,
  _get3TabJoinData,
} = require("../models/gallery.models");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.json");

// function to verify token from front-end

const authUser = async (req, res) => {
  const req_token = req.cookies.accessToken;
  const data = jwt.verify(req_token, config.secret);
  try {
    const user = await _readDb("users", "*", {
      id: data.id,
    });
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const { id, first_name, last_name, email, role } = user[0];
    return res.status(200).json({
      userId: id,
      first_name: first_name,
      last_name: last_name,
      email: email,
      role: role,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "can't authenticate" });
  }
};

// function to retrieve list of projects by search term

const searchProjects = async (req, res) => {
  // console.log(req.body.search_term);
  const selectedData = [];
  try {
    const result = await _searchDb(
      "projects",
      "project_name",
      `%${req.body.search_term}%`,
      "description"
    );
    // console.log(result);
    result.map((item) => {
      selectedData.push({
        id: item.id,
        name: item.project_name,
        about: item.description,
      });
    });
    result.length !== 0
      ? res.send(selectedData)
      : res.send({ error: "no project matches search term" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve list of projects authored by author

const getAuthorProjects = async (req, res) => {
  const selectedData = [];
  try {
    const result = await _get3TabJoinData(
      "project_authors",
      "users",
      "projects",
      "project_authors.user_id",
      "users.id",
      "project_authors.project_id",
      "projects.id",
      { user_id: req.body.user_id },
      req.body.limit,
      req.body.offset
    );
    // console.log(result);
    result.map((item) => {
      selectedData.push({
        user_id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        birth_date: item.birth_date,
        about: item.about,
        role: item.role,
        id: item.project_id,
        project_name: item.project_name,
        course_id: item.course_id,
        description: item.description,
      });
    });
    return res.send(selectedData);
    // result.length !== 0
    //   ? res.send(selectedData)
    //   : res.send({ error: "Author has no projects" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve list of projects authored by current logged-in author

const getMyProjects = async (req, res) => {
  const selectedData = [];
  const data = jwt.verify(req.cookies.accessToken, config.secret);
  try {
    const result = await _get3TabJoinData(
      "project_authors",
      "users",
      "projects",
      "project_authors.user_id",
      "users.id",
      "project_authors.project_id",
      "projects.id",
      { user_id: data.id },
      req.body.limit,
      req.body.offset
    );
    result.map((item) => {
      selectedData.push({
        user_id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        birth_date: item.birth_date,
        about: item.about,
        role: item.role,
        id: item.project_id,
        project_name: item.project_name,
        course_id: item.course_id,
        description: item.description,
      });
    });
    return res.send(selectedData);
    // result.length !== 0
    //   ? res.send(selectedData)
    //   : res.send({ error: "I have no projects" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve list of all projects for user

const getProjectsList = async (req, res) => {
  // console.log(req.body.limit, req.body.offset);
  try {
    const result = await _readDb_Limited(
      "projects",
      "*",
      req.body.limit,
      req.body.offset
    );
    // console.log(result);
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

const getProjectDetails = async (req, res) => {
  const selectedData = [];
  // console.log(req.body.project_id);
  try {
    const result = await _get3TabJoinData(
      "project_authors",
      "users",
      "projects",
      "project_authors.user_id",
      "users.id",
      "project_authors.project_id",
      "projects.id",
      { project_id: req.body.project_id },
      5,
      0
    );
    // console.log(result);
    result.map((item) => {
      selectedData.push({
        author_id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        id: item.project_id,
        project_name: item.project_name,
        course_id: item.course_id,
        description: item.description,
      });
    });
    return res.send(selectedData);
    // result.length !== 0
    //   ? res.send(selectedData)
    //   : res.send({ error: "Author has no projects" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};
// function to retrieve list of courses in db to populate option list

const getCourseList = async (req, res) => {
  try {
    const result = await _readDbNotNull("courses", "*", "id");
    // console.log(result);
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read" });
  }
};

// function to insert new project into DB

const addProject = async (req, res) => {
  const { project_name, course_id, description, authors } = req.body;
  try {
    const result = await _insertDb("projects", {
      project_name: project_name,
      course_id: course_id,
      description: description,
    });
    if (result.length > 0) {
      const dataToInsert = [];
      authors.forEach((item) => {
        dataToInsert.push({ project_id: result[0].id, user_id: item });
      });

      const addProjAuth = await _insertDb("project_authors", dataToInsert);
      console.log(addProjAuth);
      return res.send(addProjAuth);
    } else {
      return res.send({ error: "failed to add project" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert" });
  }
};

// function to insert another author for project into DB

const addAuthor = async (req, res) => {
  const { project_id, user_id } = req.body;
  try {
    const result = await _insertDb("project_authors", {
      project_id: project_id,
      user_id: user_id,
    });
    // console.log(result[0].id);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert author" });
  }
};

// function to add new images to DB

const addImages = async (req, res) => {
  // console.log(req.body);
  // console.log(req.body.project_id);
  for (const item of req.files) {
    console.log(item.uploadcare_file_id);
  }
  const fieldsToInsert = req.files.map((field) => ({
    uuid: field.uploadcare_file_id,
    url: `https://ucarecdn.com/${field.uploadcare_file_id}/`,
    project_id: req.body.project_id,
    name: field.originalname,
  }));
  try {
    const isProjectExist = await _readDb("projects", "*", {
      id: req.body.project_id,
    });
    // console.log(isProjectExist);
    if (isProjectExist.length > 0) {
      const checkImageCount = await _countRows("project_images", "uuid", {
        project_id: req.body.project_id,
      });
      // console.log(checkImageCount[0].count);
      if (checkImageCount[0].count < 3) {
        const insertImage = await _insertDb("project_images", fieldsToInsert);
        // console.log(insertImage);
        return res.send({ message: `inserted ${insertImage.length} images` });
      } else {
        return res.send({ error: "more than 3 images exist" });
      }
    } else {
      return res.send({ error: "The project id is not in the database" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert images" });
  }
};

// function to retrieve list of images for project

const getProjectImages = async (req, res) => {
  try {
    const result = await _readDb("project_images", "*", {
      project_id: req.body.project_id,
    });
    result.length !== 0
      ? res.send(result)
      : res.send({ error: "no images for this project" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't retrieve images" });
  }
};

// function to retrieve list of comments for project

const getProjectComments = async (req, res) => {
  const selectedData = [];
  try {
    const result = await _get2TabJoinData(
      "user_comments",
      "users",
      "user_id",
      "users.id",
      {
        project_id: req.body.project_id,
      }
    );
    result.map((item) => {
      selectedData.push({
        comment_id: item.comment_id,
        user_id: item.user_id,
        project_id: item.project_id,
        first_name: item.first_name,
        last_name: item.last_name,
        user_comment: item.user_comment,
      });
    });
    result.length !== 0
      ? res.send(selectedData)
      : res.send({ error: "no comments for this project" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't retrieve comments" });
  }
};

// function to delete images from db

const deleteImages = async (req, res) => {
  try {
    const result = await _deleteDb("project_images", {
      uuid: req.body.uuid,
    });
    // console.log(result);
    return res.send({ message: "deleted the image" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete images" });
  }
};

// function to add a user comment on project by logged-in user

const addComment = async (req, res) => {
  // console.log(req.body);
  try {
    const result = await _insertDb("user_comments", {
      project_id: req.body.project_id,
      user_id: req.body.user_id,
      user_comment: req.body.user_comment,
    });
    // console.log(result);
    return res.send({ message: "added the comment" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't add comment" });
  }
};

// function to delete user comments on project by creating user

const deleteComment = async (req, res) => {
  try {
    const result = await _deleteDb("user_comments", {
      comment_id: req.body.comment_id,
    });
    // console.log(result);
    return res.send({ message: "deleted the comment" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete comment" });
  }
};

// const updateInfo = async (req, res) => {
//   try {
//     let result = await _updateDb(
//       "authors",
//       { email: "ehudmi12@gmail.com" },
//       { first_name: "Ehud" }
//     );
//     console.log(result);
//     res.send("info updated");
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: "couldn't update" });
//   }
// };

// const getInfo = async (req, res) => {
//   try {
//     const result = await _readDb("users", "*", { first_name: "Ehud" });
//     console.log(result);
//     return res.send(result);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({ error: "couldn't read" });
//   }
// };

module.exports = {
  authUser,
  searchProjects,
  getAuthorProjects,
  getMyProjects,
  getProjectsList,
  getProjectDetails,
  // getInfo,
  getCourseList,
  addProject,
  addAuthor,
  addImages,
  getProjectImages,
  getProjectComments,
  deleteImages,
  addComment,
  deleteComment,
  // updateInfo,
};
