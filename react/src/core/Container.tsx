import './_container.scss';

type containerProps = {
	fluid?: boolean;
	hero?: boolean;
	fullWidth?: boolean;
	small?: boolean;
	children: React.ReactNode;
};

const Container = ({
	fluid,
	hero,
	fullWidth,
	small,
	children,
}: containerProps) => {
	const classes = () => {
		let c = fluid ? 'simpleform-container-fluid ' : 'simpleform-container ';
		c += hero ? 'simpleform-hero ' : '';
		c += fullWidth ? 'full-width ' : '';
		c += small ? 'small ' : '';
		return c;
	};

	return <div className={classes()}>{children}</div>;
};

export default Container;
