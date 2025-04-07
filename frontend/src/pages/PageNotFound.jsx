import React from 'react';
import { Link } from 'react-router-dom';
import Img from '../assets/404Img.jpg';

function PageNotFound() {
  document.title = 'CareerConnect | Page Not Found';
  return (
    <>
      <div className="flex items-center justify-center h-screen px-3 py-2 max-sm:flex-col">
        <div className="">
          <img src={Img} alt="404 cry boy Image" className='w-3/4' />
        </div>
        <div className='flex flex-col items-start justify-center gap-3'>
          <h1 className='playfair'>404</h1>
          <h2 className=''><span className='text-5xl text-red-500 dancing'>Oops!</span> Page Not found!</h2>
          <button type="button" className="btn btn-primary animate-bounce">
            <Link to='../student/login' className='text-xl text-white no-underline'>
              <i className="mr-2 fa-regular fa-hand-point-right" />
              Go to home
            </Link>
          </button>
        </div>
      </div>
    </>
  )
}

export default PageNotFound
