import { cookies } from 'next/headers';

/**
 * device_id identifica o perfil anônimo (sem cadastro). Setado pelo middleware
 * em todo request; rotas de API/páginas só leem — nunca geram aqui.
 */
export const DEVICE_ID_COOKIE = 'device_id';

export async function getDeviceId() {
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_ID_COOKIE)?.value;
}
