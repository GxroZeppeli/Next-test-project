'use server';

import { auth, signIn, signOut } from '@/../auth';
import { z } from 'zod';
import { addProductToCart, addUser, getUser } from './data';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.number(),
    quantity: z.number({ invalid_type_error: 'Please enter an integer.' })
    .int({ message: 'Please enter an integer.' })
    .gt(0, { message: 'Please enter an amount greater than 0.' }),
    case: z.string().optional()
    .refine(data => data !== '', { message: 'Please select an option.' }),
    pcb: z.string().optional()
    .refine(data => data !== '', { message: 'Please select an option.' }),
    plate: z.string().optional()
    .refine(data => data !== '', { message: 'Please select an option.' }),
});

export type State = {
    errors?: {
        case?: string;
        pcb?: string;
        plate?: string;
    };
    message?: string | null;
};

 export async function addToCart(prevState: State, data: FormData) {
    const parsedData = FormSchema.safeParse({
        ...Object.fromEntries(data.entries()),
        id: Number(data.get('id')),
        quantity: Number(data.get('quantity')),
    });
    

    if (!parsedData.success) {
        console.log(parsedData.error.formErrors.fieldErrors);
        
        return {
            errors: parsedData.error.formErrors.fieldErrors
        };
    }

    // Check if the amount requested is more than the amount available
    let quantErrors: {[key: string]: string[]} = {};
    const options: number[] = [];

    [...data.entries()].forEach(([key, value]: [string, string]) => {
        if (key !== 'id' && key !== 'quantity' && !key.includes('ACTION')) {
            const partObj = JSON.parse(value);
            options.push(partObj.id);
            if(partObj.amount < parsedData.data.quantity) {
                quantErrors[key] = ['Requested amount exceeds available quantity.'];
            }
        }
    })
    if (Object.keys(quantErrors).length > 0) {
        return {
            errors: {
                ...parsedData?.error?.formErrors?.fieldErrors,
                ...quantErrors
            }
        };
    }

    const session = await auth();

    if (!session) {
        return {
            message: 'Please login'
        };
    }
    
    await addProductToCart(session.user.email, parsedData.data.id, parsedData.data.quantity, options);

    return {
        message: 'Added to cart'
    };
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6, { message: 'Password must be at least 6 characters.' }) 
          })
          .safeParse({
              email: formData.get('email'),
              password: formData.get('password'),
          });

      if (!parsedCredentials.success) {
        return {
            errors: parsedCredentials.error.formErrors.fieldErrors
        };
      }
      await signIn('credentials', formData);
      redirect('/keyboards');
    } catch (error) {
      
      if (error?.type) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
                message: 'Invalid credentials.',
            };
          default:
            return {
                message: 'Something went wrong.',
            };
        }
      } else throw error;
    }
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
  ) {
    
    try {
        const parsedCredentials = z
            .object({ name: z.string().min(4).max(32), email: z.string().email(), password: z.string().min(6), passwordRepeat: z.string().min(6) })
            .safeParse({
                name: formData.get('name'),
                email: formData.get('email'),
                password: formData.get('password'),
                passwordRepeat: formData.get('passwordRepeat'),
            });
        
        if (parsedCredentials.success) {
            const { email, password, name, passwordRepeat } = parsedCredentials.data;
            const existingUser = await getUser(email);
            if (existingUser) {
                console.log(existingUser);
                
                return {
                    errors: {
                        email: ['User already exists.'],
                    }
                };
            }
            if (password !== passwordRepeat) {
                return {
                    errors: {
                        passwordRepeat: ['Passwords do not match.'],
                    }
                }
            }
            const passwordHash = await bcrypt.hash(password, 10);            
            await addUser(name, email, passwordHash);
            await signIn('credentials', { email, password });
      } else {
        return {
            errors: parsedCredentials.error.formErrors.fieldErrors
        }
      }

    } catch (error) {
      if (error?.type) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
                message: 'Invalid credentials.',
            };
          default:
            return {
                message: 'Something went wrong.',
            };
        }
      }
      throw error;
    }
}

export async function logout() {
    await signOut();
}