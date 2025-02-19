const LoadingSpinner = ({ size = "md" }) => {
	const sizeClass = `loading-${size}`;

	return <span className="loading loading-infinity loading-lg"></span>;
};
export default LoadingSpinner;