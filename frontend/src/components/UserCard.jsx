import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
    console.log(user)
	return (
		<div className='bg-white rounded-lg shadow sm:p-4 p-2 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "../../public/avatar.png"}
					alt={user.name}
					className='sm:w-24 sm:h-24 w-16 h-16 rounded-full object-cover sm:mb-4 mb-2'
				/>
				<h3 className='font-semibold sm:text-lg text-sm text-center'>{user.name}</h3>
			</Link>
			<p className='text-gray-600 sm:text-lg text-xs text-center'>{user.headline}</p>
			<p className='sm:text-sm text-xs text-gray-500 mt-2'>{user.connections?.length} connections</p>
			<button className='sm:mt-4 mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;