const { Router } = require('express');
const router = Router();
const {
  deleteOneOrManyUserController,
  fidyahController,
  listUserController,
  tambahUserController,
  getSetRateController
} = require('./controllers');

router.post('/hitung', fidyahController);
router.post('/tambah-user', tambahUserController);
router.get('/list-user', listUserController);
router.get('/rate', getSetRateController);
router.delete('/delete-user', deleteOneOrManyUserController);

module.exports = router;
