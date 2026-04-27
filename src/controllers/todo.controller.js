import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const { title, priority, completed, tags, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      priority,
      completed,
      tags,
      dueDate,
    });
    return res.status(201).json(todo);
  } catch (error) {
    return res.status(400).json({
      error: { message: error.message },
    });

    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    let {page = 1, limit = 10, completed, priority,search} = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
   
    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1)*limit;
    const total = await Todo.countDocuments(filter); 
    const data = await Todo.find(filter) 
      .sort({ createdAt: -1 })
      .skip(skip)   
      .limit(limit); 

    // 5. Calculate total pages
    const pages = Math.ceil(total / limit);

    return res.status(200).json({
      data,
      meta:{
        total, 
        page, 
        limit, 
        pages
      }
    })

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    // Your code here
    const{id} = req.params;
    const todo = await Todo.findById(id);
    if(!todo){
      return res.status(404).json({
        error:{
          message:"Not found"
        }
      })
    }

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    // Your code here
    const { id } = req.params;
    const { title, priority, completed, tags, dueDate } = req.body; 

    const updateFields = {};

    if (title !== undefined) updateFields.title = title;
    if (priority !== undefined) updateFields.priority = priority;
    if (completed !== undefined) updateFields.completed = completed;
    if (tags !== undefined) updateFields.tags = tags;
    if (dueDate !== undefined) updateFields.dueDate = dueDate;

    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );
    if(!updatedTodo){
      return res.status(404).json({
        error:{
          message:"Not found"
        }
      })
    }

    return res.status(200).json(updatedTodo);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
      error: { message: error.message }
      });
    }
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const {id}  = req.params;
    const todo = await Todo.findById(id);
    if(!todo){
      return res.status(404).json({
        error:{
          message:"Not found"
        }
      })
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const {id} = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if(!deletedTodo) res.status(404).json({
      error:{
        message:"Not found"
      }
    })
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
