import { Pool } from 'pg';
import sql from 'sql-template-strings';
import { formatCurrency } from './utils';

type RawProduct = {
    id: number;
    name: string;
    path: string;
    description: string;
    image: string;
    price: string;
    discount: string;
};

type Product = {
    id: number;
    name: string;
    path: string;
    description: string;
    image: string;
    price: string;
    discountedPrice: string;
    discount: string;
};

type Slide = {
    id: number;
    image: string;
    name: string;
    path: string;
    description: string;
};

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

export async function fetchLatestProducts(type: string): Promise<Product[]> {
    try {
      const client = await pool.connect();

      let data;
      switch (type) {
        case 'keyboard':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'keyboard'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'mouse':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'mouse'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'mousepad':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'mousepad'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'switch':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'switch'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'keycap':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'keycap'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'accessory':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'accessory'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'plate':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'plate'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'case':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'case'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        case 'pcb':
          data = await client.query(sql`
          SELECT *
          FROM products
          WHERE type = 'pcb'
          ORDER BY id DESC
          LIMIT 5`);
          break;
        default:
          data = await client.query(sql`
          SELECT *
          FROM products
          ORDER BY id DESC
          LIMIT 5`);
          break;
      }
      if (type) {

      }
      else {
        data = await client.query(sql`
        SELECT *
        FROM products
        ORDER BY id DESC
        LIMIT 5`);
      }

      const latestProducts = data.rows.map((product: RawProduct) => ({
        ...product,
        price: formatCurrency(+product.price),
        discountedPrice: formatCurrency(+product.price - ((+product.discount / 100) * +product.price)),
      }));

      client.release();
      return latestProducts;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch the latest products.');
    }
}

export async function fetchSlides(): Promise<Slide[]> {
    try {
      const client = await pool.connect();
      const data = await client.query(sql`
        SELECT *
        FROM slides
        ORDER BY id DESC
        LIMIT 5`);

      client.release();
      return data.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch slides.');
    }
}

const ITEMS_PER_PAGE = 24;

export async function fetchKeyboardAmount({ 
  stock,
  layout,
  brand, 
  priceGreater,
  priceLess
}: {
  stock: string,
  layout: string,
  brand: string, 
  priceGreater: number,
  priceLess: number
}) {
  try {
    
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT COUNT(*) AS amount
      FROM products
      JOIN keyboard_specs ON products.id = keyboard_specs.id
      WHERE stock = ${stock}
      AND brand ~ ${brand}
      AND price * (1 - discount/100.0) >= ${priceGreater * 100}
      AND price * (1 - discount/100.0) <= ${priceLess * 100}
      AND layout ~ ${layout}
    `);

    client.release();
    const totalPages = Math.ceil(Number(data.rows[0].amount) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch keyboard amount.');
  }
}

export async function fetchKeycapAmount({ 
  stock,
  profile,
  brand, 
  priceGreater,
  priceLess
}: {
  stock: string,
  profile: string,
  brand: string, 
  priceGreater: number,
  priceLess: number
}) {
  try {
    
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT COUNT(*) AS amount
      FROM products
      JOIN keycap_specs ON products.id = keycap_specs.id
      WHERE stock = ${stock}
      AND brand ~ ${brand}
      AND price * (1 - discount/100.0) >= ${priceGreater * 100}
      AND price * (1 - discount/100.0) <= ${priceLess * 100}
      AND profile ~ ${profile}
    `);

    client.release();
    const totalPages = Math.ceil(Number(data.rows[0].amount) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch keycap amount.');
  }
}

export async function fetchProductAmount({ 
  stock,
  brand, 
  priceGreater,
  priceLess
}: {
  stock: string,
  brand: string, 
  priceGreater: number,
  priceLess: number
}) {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT COUNT(*) AS amount
      FROM products
      WHERE stock = ${stock}
      AND brand ~ ${brand}
      AND price * (1 - discount/100.0) >= ${priceGreater * 100}
      AND price * (1 - discount/100.0) <= ${priceLess * 100}
    `);

    client.release();
    const totalPages = Math.ceil(Number(data.rows[0].amount) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product amount.');
  }
}

const mapSort = {
  'Price: Low to High': 'price * (1 - discount/100.0)',
  'Price: High to Low': 'price * (1 - discount/100.0) DESC',
  'Date: Newest': 'products.id DESC',
  'Date: Oldest': 'products.id',
  'Title: A-Z': 'name',
  'Title: Z-A': 'name DESC',
  '': 'products.id DESC'
};

export async function fetchKeyboards({ 
  stock,
  layout,
  brand,
  sort,
  priceGreater,
  priceLess, 
  page
}: {
  stock: string,
  layout: string,
  brand: string, 
  sort: string,
  priceGreater: number,
  priceLess: number,
  page: number
}) {
  sort = mapSort[sort as keyof typeof mapSort];
  
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT *
      FROM products
      JOIN keyboard_specs ON products.id = keyboard_specs.id
      WHERE stock = ${stock}
      AND brand ~ ${brand}
      AND price * (1 - discount/100.0) >= ${priceGreater * 100}
      AND price * (1 - discount/100.0) <= ${priceLess * 100}
      AND layout ~ ${layout}
    `
    .append(` ORDER BY ${sort} LIMIT ${ITEMS_PER_PAGE} OFFSET ${(page - 1) * ITEMS_PER_PAGE}`));

    client.release();
    const products = data.rows.map((product: RawProduct) => ({
      ...product,
      price: formatCurrency(+product.price),
      discountedPrice: formatCurrency(+product.price - ((+product.discount / 100) * +product.price)),
    }));
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch keyboards.');
  }
}

export async function fetchKeycaps({ 
  stock,
  profile,
  brand,
  sort,
  priceGreater,
  priceLess, 
  page
}: {
  stock: string,
  profile: string,
  brand: string, 
  sort: string,
  priceGreater: number,
  priceLess: number,
  page: number
}) {
  sort = mapSort[sort as keyof typeof mapSort];
  
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT *
      FROM products
      JOIN keycap_specs ON products.id = keycap_specs.id
      WHERE stock = ${stock}
      AND brand ~ ${brand}
      AND price * (1 - discount/100.0) >= ${priceGreater * 100}
      AND price * (1 - discount/100.0) <= ${priceLess * 100}
      AND profile ~ ${profile}
    `
    .append(` ORDER BY ${sort} LIMIT ${ITEMS_PER_PAGE} OFFSET ${(page - 1) * ITEMS_PER_PAGE}`));

    client.release();
    const products = data.rows.map((product: RawProduct) => ({
      ...product,
      price: formatCurrency(+product.price),
      discountedPrice: formatCurrency(+product.price - ((+product.discount / 100) * +product.price)),
    }));
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch keycaps.');
  }
}

export async function fetchProducts({ 
  stock,
  brand,
  sort,
  priceGreater,
  priceLess, 
  page
}: {
  stock: string,
  brand: string, 
  sort: string,
  priceGreater: number,
  priceLess: number,
  page: number
}) {
  sort = mapSort[sort as keyof typeof mapSort];
  
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT *
      FROM products
      WHERE stock = ${stock}
      AND brand ~ ${brand}
      AND price * (1 - discount/100.0) >= ${priceGreater * 100}
      AND price * (1 - discount/100.0) <= ${priceLess * 100}
    `
    .append(` ORDER BY ${sort} LIMIT ${ITEMS_PER_PAGE} OFFSET ${(page - 1) * ITEMS_PER_PAGE}`));

    client.release();
    const products = data.rows.map((product: RawProduct) => ({
      ...product,
      price: formatCurrency(+product.price),
      discountedPrice: formatCurrency(+product.price - ((+product.discount / 100) * +product.price)),
    }));
    return products;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function fetchLayouts() {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT DISTINCT layout
      FROM keyboard_specs
    `);

    client.release();
    return data.rows.map((row: { layout: string }) => row.layout);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch layouts.');
  }
}

export async function fetchProfiles() {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT DISTINCT profile
      FROM keycap_specs
    `);

    client.release();
    return data.rows.map((row: { profile: string }) => row.profile);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profiles.');
  }
}

export async function fetchBrands(type: string) {
  try {
    const client = await pool.connect();

    let data;
    if (!type) {
      data = await client.query(sql`
        SELECT DISTINCT brand
        FROM products
      `);
    }
    else {
      data = await client.query(sql`
        SELECT DISTINCT brand
        FROM products
        WHERE type = ${type}
      `); 
    }

    client.release();
    return data.rows.map((row: { brand: string }) => row.brand);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch brands.');
  }
}

export async function fetchMaxPrice(type: string) {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT max(price) as max_price
      FROM products
      WHERE type = ${type}
    `);

    client.release();
    
    return data.rows[0].max_price / 100;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch max price.');
  }
}

export async function fetchProductPage(path: string): Promise<Product> {
  try {
    const client = await pool.connect();
    
    let data;
    const type = await client.query(sql`
      SELECT type
      FROM products
      WHERE path = ${path}`
    );
    switch (type.rows[0].type) {
      case 'keyboard':
        data = await client.query(sql`
        SELECT *
        FROM products
        JOIN keyboard_specs ON products.id = keyboard_specs.id
        WHERE path = ${path}`
      );  
      break;
      case 'mouse':
        data = await client.query(sql`
        SELECT *
        FROM products
        JOIN mouse_specs ON products.id = mouse_specs.id
        WHERE path = ${path}`
      );
      break;
      case 'keycap':
        data = await client.query(sql`
        SELECT *
        FROM products
        JOIN keycap_specs ON products.id = keycap_specs.id
        WHERE path = ${path}`
      );
      break;
      case 'switch':
        data = await client.query(sql`
        SELECT *
        FROM products
        JOIN switch_specs ON products.id = switch_specs.id
        WHERE path = ${path}`
      );
      break;
    }

    const product = data?.rows[0];
    product.discountedPrice = formatCurrency(+product.price - ((+product.discount / 100) * +product.price));
    product.price = formatCurrency(+product.price);

    client.release();
    return product;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the product.');
  }
}

export async function fetchProductImages(id: number): Promise<string[]> {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT path
      FROM product_images
      WHERE product_id = ${id}`
    );

    client.release();
    return data.rows.map((row: { path: string }) => row.path);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product images.');
  }
}

export async function fetchProductQuantities(id: number): Promise<{id: number, type: string, variant: string, amount: number}[]> {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT *
      FROM product_quantity
      WHERE product_id = ${id}`
    );

    client.release();
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product quantities.');
  }
}

export async function getUser(email: string) {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT *
      FROM users
      WHERE email = ${email}`
    );

    client.release();
    return data.rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function addUser(name: string, email: string, passwordHash: string) {
  try {
    const client = await pool.connect();
    await client.query(sql`
      INSERT INTO users (name, email, pass_hash) 
      VALUES (${name}, ${email}, ${passwordHash})`
    );

    client.release();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create user.');
  }
}

export async function addProductToCart(email: string, product_id: number, quantity: number, options: number[]) {
  try {
    const client = await pool.connect();
    const cart_id = await client.query(sql`
      INSERT INTO cart_entries (email, product_id, amount) 
      VALUES (${email}, ${product_id}, ${quantity})
      RETURNING id`
    ).then((data: any) => data.rows[0].id);
    options.forEach(async (option) => {
      await client.query(sql`
        INSERT INTO cart_details (cart_id, option_id) 
        VALUES (${cart_id}, ${option})`
      );
    });

    client.release();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to add to cart.');
  }
}

export async function getCartContent(email: string) {
  if (!email) return {};
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT ce.id, ce.product_id, ce.amount, pd.name, pd.price, pd.discount, pd.image, pd.path, pq.type, pq.variant
      FROM cart_entries ce
      JOIN cart_details cd ON ce.id = cd.cart_id
      JOIN products pd ON ce.product_id = pd.id
      JOIN product_quantity pq ON cd.option_id = pq.id
      WHERE ce.email = ${email}`
    );

    const cart: any = {};
    data.rows.forEach((row: any) => {
      if (!cart[row.id]) cart[row.id] = {
        ...row,
        options: [{type: row.type, variant: row.variant}]
      };
      else cart[row.id].options.push({type: row.type, variant: row.variant});
    });

    client.release();
    return cart;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cart.');
  }
}

export async function alterProductAmount(cart_entry: number, amount: number) {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT pq.amount
      FROM product_quantity pq
      JOIN cart_details cd ON cd.option_id = pq.id
      WHERE cd.cart_id = ${cart_entry}`
    );

    data.rows.forEach((row: any) => {
      if (row.amount < amount) {
        client.release();
        return false;
      }
    });

    await client.query(sql`
      UPDATE cart_entries
      SET amount = ${amount}
      WHERE id = ${cart_entry}`
    );
    client.release();
    return true;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to change amount.');
  }
}

export async function deleteFromCart(cart_entry: number) {
  try {
    const client = await pool.connect();
    await client.query(sql`
      DELETE FROM cart_details
      WHERE cart_id = ${cart_entry}`
    );
    await client.query(sql`
      DELETE FROM cart_entries
      WHERE id = ${cart_entry}`
    );

    client.release();
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete from cart.');
  }
}

export async function placeOrder(email: string) {
  try {
    const client = await pool.connect();

    const quantities = await client.query(sql`
      SELECT ce.amount entryAmount, pq.amount optionAmount, cd.option_id
      FROM cart_entries ce
      JOIN cart_details cd ON ce.id = cd.cart_id
      JOIN product_quantity pq ON cd.option_id = pq.id
      WHERE ce.email = ${email}`
    );
    const options = new Set();
    quantities.rows.forEach((row: any) => {      
      options.add(JSON.stringify({id: row.option_id, amount: row.entryamount}));
      if (row.entryamount > row.optionamount) {
        client.release();
        return false;
      }
    });

    const price = await client.query(sql`
      SELECT sum((pd.price - (pd.price * (pd.discount / 100.0))) * ce.amount) as total
      FROM cart_entries ce
      JOIN products pd ON ce.product_id = pd.id
      WHERE ce.email = ${email}`
    );
    
    const orderId = await client.query(sql`
      INSERT INTO orders (id, email, order_date, price)
      VALUES (gen_random_uuid(), ${email}, CURRENT_DATE, ${price.rows[0].total})
      RETURNING id`
    );

    const id = await client.query(sql`
      INSERT INTO order_entries
      SELECT id, ${orderId.rows[0].id}, product_id, amount
      FROM cart_entries
      WHERE email = ${email}
      RETURNING id`
    );

    id.rows.forEach(async (row: any) => {
      await client.query(sql`
        INSERT INTO order_details (order_entry_id, option_id)
        SELECT ${row.id}, option_id
        FROM cart_details
        WHERE cart_id = ${row.id}`
      );
    });

    id.rows.forEach(async (row: any) => {
      await client.query(sql`
        DELETE FROM cart_entries
        WHERE id = ${row.id}`
      );
    });

    // decrease stock
    options.forEach(async (option) => {
      const { id, amount } = JSON.parse(option as string);
      console.log(id, amount, option);
      

      await client.query(sql`
        UPDATE product_quantity
        SET amount = amount - ${amount}
        WHERE id = ${id}`
      );
    });

    client.release();
    return true;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to place order.');
  }
}

export async function getUsername(email: string) {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT name FROM users
      WHERE email = ${email}`
    );

    client.release();
    return data.rows[0].name;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get username.');
  }
}

export async function getOrders(email: string) {
  try {
    const client = await pool.connect();
    const data = await client.query(sql`
      SELECT o.id, o.order_date, o.price, o.status, oe.amount, p.name, p.image, p.path FROM orders o
      JOIN order_entries oe ON o.id = oe.order_id
      JOIN products p ON p.id = oe.product_id
      WHERE o.email = ${email}`
    );
    const orders: any = {};
    data.rows.forEach((row: any) => {
      if (!orders[row.id]) orders[row.id] = {
        id: row.id,
        date: row.order_date.toLocaleDateString().replace(/\//g, '-'),
        price: formatCurrency(row.price),
        status: row.status,
        products: [{name: row.name, image: row.image, path: row.path, amount: row.amount}]
      };
      else orders[row.id].products.push({name: row.name, image: row.image, path: row.path, amount: row.amount});
    });

    client.release();
    return Object.values(orders);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to get orders.');
  }
}