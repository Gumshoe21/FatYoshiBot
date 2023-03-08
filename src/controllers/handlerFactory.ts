// LECTURE 160
import catchAsync from './../utils/catchAsync';
import AppError from "../utils/appError";
import APIFeatures from "./../utils/apiFeatures";

export const deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id)
		// 204 is no content - we don't send data back, we just send 'null' - to show that the resource we deleted no longer exists
		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		res.status(204).json({
			status: 'success',
			data: null
		})
	})

export const updateOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			//  setting new to 'true' will will return the document after the update is complete
			new: true,
			runValidators: true
		})
		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}
		res.status(200).json({
			status: 'success',
			data: {
				data: doc
			}
		})
	})

export const createOne = Model =>
	catchAsync(async (req, res, _next) => {
		const doc = await Model.create(req.body)
		res.status(201).json({
			status: 'success',
			data: {
				data: parseInt(doc)
			}
		})
	})

export const getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id)
		if (popOptions) query = query.populate(popOptions)
		const doc = await query

		if (!doc) {
			return next(new AppError('No document found with that ID', 404))
		}

		res.status(200).json({
			status: 'success',
			data: {
				data: doc
			}
		})
	})

export const getAll = Model =>
	catchAsync(async (req, res, _next) => {
		// To allow for nested GET reviews on tour
		let filter = {}

		if (req.params.tourId) filter = { tour: req.params.tourId } // if there's a tourId, then the object 'filter' will go into Review.find(filter) below (lecture 159) so only the reviews where the tour matches the id are going to be found;

		const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate()
		// const doc = await features.query.explain(); // generate statistics in responses

		const doc = await features.query
		res.status(200).json({
			status: 'success',
			results: doc.length,
			data: {
				data: doc
			}
		})
	})
