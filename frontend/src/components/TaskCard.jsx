import React from 'react'
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Calendar, CheckCircle, CheckCircle2, SquarePen, Trash2 } from 'lucide-react';
import { Input } from './ui/input';
import { cn } from "@/lib/utils";

const TaskCard = ({ task, index }) => {
  let isEditing = false;

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === "completed" && "opacity-75"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "completed"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          {task.status === "completed" ? (
            <CheckCircle2 className='size-5' />
          ) : (
            <CheckCircle className='size-5' />
          )}
        </Button>

        <div className='flex-1 min-w-0'>
          {isEditing ? (
            <Input
              placeholder='Cần phải làm gì?'
              className='flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20'
              type='text'
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "completed"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          )}
        </div>
        <div className='flex items-center gap-2 mt-1'>
            <Calendar className='size-3 text-muted-foreground'/>
            <span className='text-xs text-muted-foreground'>
              {new Date(task.dueDate).toLocaleString()}
            </span>
            {task.completedAt &&(
              <>
              <span className='text-xs text-muted-foreground'> - </span>
              <Calendar className='size-3 text-muted-foreground'/>
              <span className='text-xs text-muted-foreground'>
                {new Date(task.completedAt).toLocaleString()}
              </span>
              </>
            )}
        </div>
        <div className='hidden gap-2 group-hover:flex animate-slide-up'>
            <Button
              variant='ghost'
              size='icon'
              className='flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info'
            >
              <SquarePen className='siza-4'/>
            </Button> 
            <Button
              variant='ghost'
              size='icon'
              className='flex-shrink-0 transition-colors size-8 text-muted-foreground hover:text-info'
            >
              <Trash2 className='siza-4'/>
            </Button> 
        </div>
      </div>
    </Card>  
  );
};

export default TaskCard;
