const { Router } = require('express');
const Course = require('../models/products'); // Убедитесь, что модель импортирована правильно
const router = Router();

// GET /courses - отображение списка курсов
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('courses', {
      title: 'Курсы',
      isCourses: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/ed', async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('edit', {
      title: 'Курсы',
      isCourses: true,
      courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /courses/search - поиск курсов
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const category = req.query.category;
    if (!searchTerm || typeof searchTerm !== 'string') {
      throw new Error('Invalid search term');
    }
    let query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    if (category) {
      query.category = category;
    }
    const courses = await Course.find(query);
    res.render('search', {
      title: 'Результаты поиска',
      isCourses: true,
      courses
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /courses/:id/edit - страница редактирования курса
router.get('/:id/edit', async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);
    res.render('course-edit', {
      title: `Редактировать ${course.title}`,
      course
    });
  } catch (error) {
    console.error('Error fetching course for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /courses/edit - обновление курса
router.post('/edit', async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;
    await Course.findByIdAndUpdate(id, req.body);
    res.redirect('/courses');
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET /courses/:id - отображение информации о курсе
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }
    res.render('course', {
      layout: 'empty',
      title: `Курс ${course.title}`,
      course,
      user: req.user 
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /courses/:id/comments - добавление комментария к курсу
router.post('/:id/comments', async (req, res) => {
  try {
    const { user, text } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send('Course not found');
    }

    const newComment = { user, text, date: new Date() };
    course.comments.push(newComment);
    await course.save();

    res.json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /courses/:id/delete - удаление курса
router.post('/:id/delete', async (req, res) => {
  try {
    await Course.findByIdAndRemove(req.params.id);
    res.redirect('/courses');
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;