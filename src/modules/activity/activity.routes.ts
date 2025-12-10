import { Router } from "express";
import { activitiesController } from "./index";
import { validate } from "../../middlewares/validate";
import { CreateActivitySchema, UpdateActivitySchema } from "./dto";
import { authenticate } from "../../middlewares/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// --------------------------------------
// Get all activities (timeline, with filters)
// GET /activities?targetType=Lead&targetId=123
// --------------------------------------
router.get("/", activitiesController.findAll);

// --------------------------------------
// Create a new activity
// --------------------------------------
router.post("/", validate(CreateActivitySchema), activitiesController.create);

// --------------------------------------
// Update an activity by ID
// --------------------------------------
router.patch(
  "/:id",
  validate(UpdateActivitySchema),
  activitiesController.update
);

// --------------------------------------
// Delete an activity by ID
// --------------------------------------
router.delete("/:id", activitiesController.delete);

// --------------------------------------
// Get a single activity by ID
// --------------------------------------
router.get("/:id", activitiesController.findById);

export default router;