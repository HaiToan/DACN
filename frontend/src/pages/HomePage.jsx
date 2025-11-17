import AddTask from '@/components/AddTask';
import DateTimeFilter from '@/components/DateTimeFilter';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import StatsAndFilters from '@/components/StatsAndFilters';
import TaskList from '@/components/TaskList';
import TaskListPagination from '@/components/TaskListPagination';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import axios from 'axios';


const HomePage = () => {
  const [taskBuffer, settaskBuffer] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/tasks');
      settaskBuffer(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks.", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks.");
    }
  }
  return(
    <div className="min-h-screen w-full bg-[#020617] relative">
  {/* Orange Radial Glow Background */}
  <div
    className="absolute inset-0 z-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(249,115,22,0.4), transparent)`,
    }}
  />
  {/* Your Content/Components */}
   <div className='container pt-8 mx-auto'>
      <div className='w-full max-w-2xl p-6 mx-auto space-y-6'>
        {/*Đầu trang*/}
        <Header/>

        {/*Tạo nhiệm vụ*/}
        <AddTask/>

        {/*Thống kê và Bộ lọc*/}
        <StatsAndFilters/>

        {/*Danh sách nhiệm vụ*/}
        <TaskList filteredTasks={taskBuffer}/>
        <div className='flex flex-col items-center justify-between gap-6 sm:flex-row'>
            <TaskListPagination/>
            <DateTimeFilter/>

        </div>

        {/*Chân trang*/}
        <Footer/>

      </div>

    </div>
</div>
  );
}

export default HomePage
