import express from 'express';

import { FilterController } from '../controllers';

const router = express.Router();

router.get('/:formId/filteredResponses', FilterController);

export default router;
