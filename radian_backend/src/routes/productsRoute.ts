import express from "express";
import AppDataSource from "../dataSource";


const productRouter = express.Router()

productRouter.use(express.json())

const appDataSource = AppDataSource

