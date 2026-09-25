const fs = require('fs');

let js = fs.readFileSync('assets/js/menu-data.js', 'utf8');

const replacement = `  // Pizzas
  { name: 'Chicken Fajita Pizza',  desc: 'Spiced fajita chicken with fresh veggies.',            price: 'Rs 1350', img: 'assets/images/pizza-1.avif',             category: 'Pizzas' },
  { name: 'Tikka Sensation Pizza', desc: 'Spicy chicken tikka chunks on a rich base.',           price: 'Rs 1450', img: 'assets/images/pizza-2.avif',             category: 'Pizzas' },
  { name: 'Pepperoni Classic Pizza', desc: 'Loaded with premium pepperoni slices.',              price: 'Rs 1600', img: 'assets/images/pizza-3.avif',             category: 'Pizzas' },
  { name: 'Crown Crust pizza',   desc: 'Blend of 100% real mozzarella cheese.',                price: 'Rs 1300', img: 'assets/images/pizza-4.avif',             category: 'Pizzas' },
  { name: 'BBQ Chicken Pizza',   desc: 'Grilled chicken with smoky BBQ sauce and onions.',                price: 'Rs 1400', img: 'assets/images/pizza-5.avif',             category: 'Pizzas' },
  { name: 'Mushroom Delight Pizza',   desc: 'Loaded with fresh mushrooms and extra cheese.',                price: 'Rs 1350', img: 'assets/images/pizza-6.avif',             category: 'Pizzas' },
  { name: 'Spicy Veggie Pizza',   desc: 'Fresh veggies with a spicy kick.',                price: 'Rs 1250', img: 'assets/images/pizza-7.avif',             category: 'Pizzas' },
  // Rolls`;

// Replace from `// Pizzas` up to `// Rolls`
const regex = /\/\/ Pizzas[\s\S]*?\/\/ Rolls/;
const newJS = js.replace(regex, replacement);
fs.writeFileSync('assets/js/menu-data.js', newJS, 'utf8');
console.log('menu-data.js updated successfully.');
