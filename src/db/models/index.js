import User from "./user.js";
import Project from "./project.js";
import Transfer from "./transfer.js";
import Issue from "./issue.js";
import Vote from "./vote.js";
import Installation from "./installation.js";

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
User.hasMany(Project);
Project.belongsTo(User);

User.hasMany(Vote);
Vote.belongsTo(User);

User.hasMany(Installation);
Installation.belongsTo(User);

Project.hasMany(Transfer);
Transfer.belongsTo(Project);

Issue.belongsTo(Project);
Project.hasMany(Issue);

Issue.hasMany(Vote);
Vote.belongsTo(Issue);

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
export { User, Project, Transfer, Issue, Vote, Installation };
