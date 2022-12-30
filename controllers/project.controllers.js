const {
  _readDb,
  _readDb_LimitedWhere,
  _countRows,
  _insertDb,
  _deleteDb,
  _get2TabJoinData,
  _get3TabJoinData,
} = require("../models/gallery.models");
const jwt = require("jsonwebtoken");

// function to verify token from front-end

const authUser = async (req, res) => {
  const req_token = req.cookies.accessToken;
  const data = jwt.verify(req_token, process.env.JWT_SECRET);
  try {
    const user = await _readDb("users", "*", "id", "=", data.id, "id", "ASC");
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

// function to count all projects

const getCountProjects = async (req, res) => {
  try {
    const result = await _countRows("projects", "*", "id", ">", "0");
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't count projects" });
  }
};

// function to count current author projects

const getCountMyProjects = async (req, res) => {
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
  try {
    const result = await _countRows(
      "project_authors",
      "*",
      "user_id",
      "=",
      data.id
    );
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't count my projects" });
  }
};

// function to retrieve list of all projects for user no limits

const getFullProjectsList = async (req, res) => {
  try {
    const result = await _readDb(
      "projects",
      "*",
      "id",
      ">",
      0,
      "project_name",
      "ASC"
    );
    return res.send(result);
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
      req.body.offset,
      "projects.project_name",
      "ASC"
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
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve list of projects authored by current logged-in author

const getMyProjects = async (req, res) => {
  const selectedData = [];
  const data = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET);
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
      req.body.offset,
      "projects.project_name",
      "ASC"
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
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve list of all projects for user

const getProjectsList = async (req, res) => {
  try {
    const result = await _readDb_LimitedWhere(
      "projects",
      "*",
      "id",
      ">",
      0,
      req.body.limit,
      req.body.offset,
      "project_name",
      "ASC"
    );
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve details of specific project

const getProjectDetails = async (req, res) => {
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
      { project_id: req.body.project_id },
      5,
      0,
      "projects.id",
      "ASC"
    );
    result.map((item) => {
      selectedData.push({
        author_id: item.user_id,
        first_name: item.first_name,
        last_name: item.last_name,
        id: item.project_id,
        project_name: item.project_name,
        course_id: item.course_id,
        description: item.description,
        link: item.link,
      });
    });
    return res.send(selectedData);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read projects" });
  }
};

// function to retrieve list of courses in db to populate option list

const getCourseList = async (req, res) => {
  try {
    const result = await _readDb("courses", "*", "id", "<>", "", "name", "ASC");
    return res.send(result);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't read" });
  }
};

// function to insert new project into DB

const addProject = async (req, res) => {
  const { project_name, course_id, description, authors, link } = req.body;
  try {
    const result = await _insertDb("projects", {
      project_name: project_name,
      course_id: course_id,
      description: description,
      link: link,
    });
    if (result.length > 0) {
      const dataToInsert = [];
      authors.forEach((item) => {
        dataToInsert.push({ project_id: result[0].id, user_id: item });
      });

      const addProjAuth = await _insertDb("project_authors", dataToInsert);
      return res.send(addProjAuth);
    } else {
      return res.send({ error: "failed to add project" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't insert" });
  }
};

// function to delete project from DB

const deleteProject = async (req, res) => {
  try {
    const result = await _deleteDb("projects", {
      id: req.body.project_id[0],
    });
    return res.send({ message: "deleted the project" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete project" });
  }
};

// function to add new images to DB

const addImages = async (req, res) => {
  const fieldsToInsert = req.files.map((field) => ({
    uuid: field.uploadcare_file_id,
    url: `https://ucarecdn.com/${field.uploadcare_file_id}/`,
    project_id: req.body.project_id,
    name: field.originalname,
  }));
  try {
    const isProjectExist = await _readDb(
      "projects",
      "*",
      "id",
      "=",
      req.body.project_id,
      "id",
      "ASC"
    );
    if (isProjectExist.length > 0) {
      const checkImageCount = await _countRows(
        "project_images",
        "uuid",
        "project_id",
        "=",
        req.body.project_id
      );
      if (checkImageCount[0].count < 3) {
        const insertImage = await _insertDb("project_images", fieldsToInsert);
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
    const result = await _readDb(
      "project_images",
      "*",
      "project_id",
      "=",
      req.body.project_id,
      "name",
      "ASC"
    );
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
      },
      "user_comment",
      "ASC"
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
    return res.send({ message: "deleted the image" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete images" });
  }
};

// function to add a user comment on project by logged-in user

const addComment = async (req, res) => {
  try {
    const result = await _insertDb("user_comments", {
      project_id: req.body.project_id,
      user_id: req.body.user_id,
      user_comment: req.body.user_comment,
    });
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
    return res.send({ message: "deleted the comment" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "couldn't delete comment" });
  }
};

module.exports = {
  authUser,
  getCountProjects,
  getCountMyProjects,
  getFullProjectsList,
  getAuthorProjects,
  getMyProjects,
  getProjectsList,
  getProjectDetails,
  getCourseList,
  addProject,
  deleteProject,
  addImages,
  getProjectImages,
  getProjectComments,
  deleteImages,
  addComment,
  deleteComment,
};
