import { supabase } from './supabaseClient';

export type Achievement = {
  id?: number;
  user_id: string;
  category: string;  // "1", "2", "3", "4"
  level: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
};

// Determina el target (meta) según la categoría
function getTargetForCategory(category: string): number {
  switch (category) {
    case '1': // Resistencia: 10 minutos = 600 segundos
      return 600;
    case '2': // Fuerza: 20 sentadillas
      return 20;
    case '3': // Velocidad: 30 saltos en 30 seg
      return 30;
    case '4': // Equilibrio: 60 segundos
      return 60;
    default:
      return 0;
  }
}

/**
 * Actualiza o inserta el logro para un usuario.
 * @param userId - El ID del usuario (uuid).
 * @param category - La categoría del logro ("1", "2", "3", "4").
 * @param level - El nivel del logro (por ejemplo, 1).
 * @param value - El valor obtenido en el juego (en segundos o repeticiones).
 * @param cumulative - Si es acumulativo (true) o se toma el valor absoluto (false).
 */
export async function updateAchievementProgress(
  userId: string,
  category: string,
  level: number,
  value: number,
  cumulative: boolean = true
) {
  const target = getTargetForCategory(category);

  // Intentar obtener el registro actual del logro para este usuario, categoría y nivel
  const { data: currentAchievement, error: fetchError } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .eq('level', level)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
    // No se encontró registro: insertamos uno nuevo
    const newAchievement: Achievement = {
      user_id: userId,
      category,
      level,
      progress: value,
      target,
      completed: value >= target,
      claimed: false,
    };

    const { error: insertError } = await supabase
      .from('achievements')
      .insert(newAchievement);
    if (insertError) {
      console.error('Error al insertar logro:', insertError.message);
    }
  } else if (currentAchievement) {
    // Registro existente: actualizamos el progreso
    const updatedProgress = cumulative
      ? currentAchievement.progress + value
      : value;
    const completed = updatedProgress >= target;
    const { error: updateError } = await supabase
      .from('achievements')
      .update({ progress: updatedProgress, completed })
      .eq('id', currentAchievement.id);
    if (updateError) {
      console.error('Error al actualizar logro:', updateError.message);
    }
  } else {
    // Otro tipo de error
    console.error('Error al obtener el logro:', fetchError?.message);
  }
}
