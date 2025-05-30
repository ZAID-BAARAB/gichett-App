import bank from '../../assets/icons/bank.png';
import maroc from '../../assets/icons/morocco.png';



// Add other icons as needed
const iconMap: Record<string, any> = {
  'maroc.png': maroc,
  'bank': bank,

  // Register other icons here:
  // 'france.png': france,
};

export const getIconSource = (iconName: string) => {
  return iconMap[iconName] || maroc;
};