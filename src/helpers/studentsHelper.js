'use strict';

import Students from "../models/students.model.js";
import BaseHelper from "./baseHelper.js";

const StudentHelper = new BaseHelper(Students);

export default StudentHelper