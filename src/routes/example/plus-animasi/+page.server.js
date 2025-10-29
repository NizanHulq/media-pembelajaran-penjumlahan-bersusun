import { redirect } from '@sveltejs/kit';

export const load = () => {
  throw redirect(307, '/example/plus-animasi/1');
};

