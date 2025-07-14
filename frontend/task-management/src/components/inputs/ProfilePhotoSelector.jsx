import { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
const ProfilePhotoSelector = ({ image, setImage }) => {
      const inputRef = useRef(null);
      const [preview, setPreview] = useState(null);
      const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                  setImage(file);
                  const previewImg = URL.createObjectURL(file);
                  setPreview(previewImg);
            }

      }
      const handleRemoveFile = () => {
            setImage(null);
            setPreview(null);

      }
      const onChooseFile = () => {
            inputRef.current.click();
      }
      return (
            
            <div className="flex justify-center mb-6">
                  <input type="file"
                        accept='image/*'
                        ref={inputRef}
                        onChange={handleFileChange}
                        className=''
                  />
                  {!image ? (
                        <div className='w-20 h-20 flex items-center justify-center bg-blue-100/50 roundered-full cursor-pointer relative'>
                              <LuUser className="text-4xl text-primary" />
                              <button className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                               type='button' onClick={onChooseFile}>
                                    <LuUpload />
                              </button>
                        </div>
                  ) : (
                        <div className='relative'>
                              <img src={preview} 
                              alt='profile photo'
                              className='w-20 h-20 rounded-full object-cover'
                              />
                              <button type='button' onClick={handleRemoveFile} 
                              className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'>
                              <LuTrash />
                              </button>
                        </div>

                  )}
            </div>
      )
}

export default ProfilePhotoSelector