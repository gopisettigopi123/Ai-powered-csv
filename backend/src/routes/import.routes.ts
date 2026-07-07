import { Router } from 'express';
import multer from 'multer';
import { ImportController } from '../controllers/import.controller';
import { LeadController } from '../controllers/lead.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const importController = new ImportController();
const leadController = new LeadController();

router.post('/upload', upload.single('file'), importController.upload.bind(importController));
router.post('/upload-batch', importController.uploadBatch.bind(importController));
router.get('/leads', leadController.getLeads.bind(leadController));

export default router;
