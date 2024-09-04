import {Request,Response} from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto, UpdateTodoDto } from '../../domain/dtos';



export class TodosController{

    //* DI
    constructor(){}
    
    public getTodos=async(req:Request,res:Response)=>{
        const allTodos=await prisma.todo.findMany();
        res.json(allTodos);
        }
    
    public getTodoById=async (req:Request,res:Response)=>{
        const id= +req.params.id;

        const todoById= await prisma.todo.findUnique({
            where: {id: id}
        });
        if(isNaN(id)) return res.status(400).json({error:'ID'});
        (todoById)
            ?res.json(todoById)
            :res.status(404).json({error:`TODO with id ${id} not found`});
    }

    public createTodo=async(req:Request,res:Response)=>{
        const [error,createTodoDto]=CreateTodoDto.create(req.body);
        if(error) return res.status(400).json({error});

        const todo=await prisma.todo.create({
            data: createTodoDto!
        });

        res.json(todo);
    }

    public updateTodo=async (req:Request,res:Response)=>{
        const id= +req.params.id;
        const [error,updateTodoDto]= UpdateTodoDto.create({...req.body,id});
        if(error) return res.status(400).json({error});

        const todoUpdated= await prisma.todo.update({
            where:{id:id},
            data:updateTodoDto!.values
        })


        res.json(todoUpdated);
    }

    public deleteTodo =async (req:Request,res:Response) =>{
        const id = +req.params.id;

        const todoById= await prisma.todo.findUnique({
            where: {id: id}
        });
        if(!todoById) return res.status(404).json({error:`Todo with id ${id} not found`});

        const deletedTodo= await prisma.todo.delete({
            where:{id:id}
        });
        

        (deletedTodo)
            ? res.json(deletedTodo)
            : res.status(400).json({error:`Todo with id ${id} not found`});
        
    }

    
}