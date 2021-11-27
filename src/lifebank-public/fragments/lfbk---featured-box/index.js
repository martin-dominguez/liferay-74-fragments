const featuredBox = fragmentElement.querySelector('.featured-box');

let backgroundType = configuration.iconColor.split('-')[0];

featuredBox.addEventListener('mouseenter', (e) => {
	const fasIcon = featuredBox.querySelector('.fas');
	fasIcon.classList.add(`text-${backgroundType}`);
	fasIcon.classList.add(`text-${configuration.iconColor}`);
	fasIcon.classList.remove('text-white');
});


featuredBox.addEventListener('mouseleave', (e) => {
	const fasIcon = featuredBox.querySelector('.fas');
	fasIcon.classList.remove(`text-${backgroundType}`);
	fasIcon.classList.remove(`text-${configuration.iconColor}`);
	fasIcon.classList.add('text-white');
});