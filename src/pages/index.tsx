import Image from 'next/image';
import appPreviewImg from '../assets/nlw-copa-mobile-preview.png';
import logoImg from '../assets/logo.svg';
import checkIconImg from '../assets/check-icon.svg';
import userAvatarImg from '../assets/user-avatar-example.png';
import { api } from '../lib/api';
import { FormEvent, useState } from 'react';

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    try {
      const { data } = await api.post('/pools', {
        title: poolTitle,
      });

      await navigator.clipboard.writeText(data.code);

      setPoolTitle('');

      alert(
        'Bolão criado com sucesso. O código já está na área de transferência.'
      );
    } catch (error) {
      console.log(error);
      alert('Error ao criado Bolão. Tente novamente.');
    }
  }

  return (
    <div className="max-w-[1124px] mt-16 h-screen grid gap-28 grid-cols-2 items-center mx-auto">
      <main>
        <Image src={logoImg} alt="NLW copa Logo" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex gap-2 items-center">
          <Image src={userAvatarImg} alt="Imagens de usuários" />
          <p className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span>
            <span>pessoas já estão usando</span>
          </p>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input
            className="flex-1 py-6 px-4 rounded bg-gray-800 border border-gray-600 text-sm text-zinc-100"
            type="text"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
            required
            placeholder="Qual o nome do seu bolão?"
          />
          <button
            className="bg-yellow-500 py-6 px-4 rounded font-bold uppercase text-sm hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.poolCount}</span>
              <span>Bolões criados </span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="App mobile preview" quality={100} />
    </div>
  );
}

export async function getServerSideProps() {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api('http://localhost:3001/pools/count'),
      api('http://localhost:3001/guesses/count'),
      api('http://localhost:3001/users/count'),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
}
