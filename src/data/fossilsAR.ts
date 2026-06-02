import { FossilAR } from "@/types";

export const fossilsAR: FossilAR[] = [
  {
    id: 'glyptodon',
    name: 'Gliptodonte',
    lat: -34.9219,
    lng: -57.9532,
    model: '/assets/models3D/gliptodonte3D.glb',
    scale: 0.001,
    funfact: 'Los gliptodontes poseían un caparazón óseo que protegía gran parte de su cuerpo.',
  },
  {
    id: 'smilodon',
    name: 'Tigre dientes de sable',
    lat: -34.9219,
    lng: -57.9540,
    model: '/assets/models3D/gliptodonte3D.glb',
    scale: 0.001,
    funfact:
      'El Smilodon no era un tigre verdadero. Sus colmillos podían superar los 20 cm de longitud.',
  },
];
