import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";

import api, { ICommonHeaderProperties } from "../services/api";
import { getAnimalsApi, IAnimals } from "../services/getAnimalsApi";
import { IUserData, IUserLogin, loginUsers } from "../services/loginUserApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IUpdateUser, upDateUserApi } from "../services/updateUserApi";
import { getUsers } from "../services/getUser";
/* import { string } from "yup"; */
import { IUserRegister } from "../services/registerUserApi";
import { getAnimalsId } from "../services/getAnimalsId";
import { getSuppliesApi, ISupplies } from "../services/getSuppliesApi";

export interface IAuthContextProps {
  children: ReactNode;
}

interface IAuthContext {
  loginUser: (data: IUserLogin) => Promise<void>;
  loginRoute: () => void;
  listAnimals: IAnimals[];
  listSupplies: ISupplies[];
  user: IUserData;
  isLogged: boolean;
  loading: boolean;
  loginButton: boolean;
  setLoginButton: Dispatch<SetStateAction<boolean>>;
  donationButton: boolean;
  setDonationButton: Dispatch<SetStateAction<boolean>>;
  backProfile: () => void;
  adopted: boolean;
  setAdopted: Dispatch<SetStateAction<boolean>>;
  deleteAnimal: (id: string) => void;
  modalUpdateUser: boolean;
  setModalUpdateUser: Dispatch<SetStateAction<boolean>>;
  updateUser: (id: IUpdateUser) => Promise<void>;
  registerUser: (data: IUserRegister) => void;
  lisAnimalsUser: IAnimals[];
  registerPet: (data: {}) => void;
  setIsShowModalPet: Dispatch<SetStateAction<boolean>>;
  isShowModalPet: boolean;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: IAuthContextProps) => {
  const navigate = useNavigate();
  const [listAnimals, setListAnimals] = useState<IAnimals[]>([]);
  const [lisAnimalsUser, setLisAnimalsUser] = useState<IAnimals[]>([]);
  const [user, setUser] = useState<IUserData>({} as IUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [loginButton, setLoginButton] = useState<boolean>(true);
  const [donationButton, setDonationButton] = useState<boolean>(true);
  const [adopted, setAdopted] = useState<boolean>(true);
  const [modalUpdateUser, setModalUpdateUser] = useState<boolean>(false);
  const [isShowModalPet, setIsShowModalPet] = useState<boolean>(false);
  const [listSupplies, setListSupplies] = useState<ISupplies[]>([])

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("@AuqMia:token");
      if (token) {
        try {
          api.defaults.headers = {
            Authorization: `bearer ${token}`,
          } as ICommonHeaderProperties;
          getUsers().then((res: any) => {
            setUser(res);
          });
          getAnimalsId().then((res) => setLisAnimalsUser(res));
          setIsLogged(true);
        } catch (err) {
          console.log(err);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [isShowModalPet]);

  useEffect(() => {
    getAnimals();
    getSupplies();
  }, []);

  const loginUser = async (data: IUserLogin) => {
    loginUsers(data)
      .then((res) => {
        const { user: userReponse, accessToken } = res;
        api.defaults.headers = {
          Authorization: `bearer ${accessToken}`,
        } as ICommonHeaderProperties;
        setUser(userReponse);
        setIsLogged(true);
        toast.success("Usuário logado com sucesso!", {
          autoClose: 900,
          theme: "dark",
        });
        navigate("/profile", { replace: true });
        localStorage.setItem("@AuqMia:token", accessToken);

        localStorage.setItem("@AuqMia:id", `${userReponse.id}`);
      })
      .catch((err) =>
        toast.error("Senha ou email incorreto.", {
          autoClose: 900,
          theme: "dark",
        })
      );
  };

  const backProfile = () => {
    navigate("/");
    localStorage.removeItem("@AuqMia:token");
    localStorage.removeItem("@AuqMia:id");
  };

  const loginRoute = () => {
    navigate("/login");
  };

  const getAnimals = async () => {
    await getAnimalsApi()
      .then((res) => {
        setListAnimals(res);
      })
      .catch((err) => console.log(err));
  };

  const getSupplies = async () => {
    await getSuppliesApi()
    .then((res) => {
      setListSupplies(res)
      console.log(res)
    })
    .catch((err) => console.log(err))
  }

  const deleteAnimal = async (id: string) => {
    const token = localStorage.getItem("@AuqMia:token");

    await api.delete(`animals/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await getAnimals();
  };

  const registerPet = (data: {}) => {
    const token = localStorage.getItem("@AuqMia:token");
    const id = localStorage.getItem("@AuqMia:id");
    const req = { userID: id, ...data };

    if (token) {
      api
        .post("/animals", req, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          toast.success("Animal cadastrado com sucesso!", {
            autoClose: 900,
            theme: "dark",
          });
          setIsShowModalPet(!isShowModalPet);
        })
        .catch((err) => {
          toast.error("Aconteceu algum erro, verefique os dados!", {
            autoClose: 900,
            theme: "dark",
          });
        });
    }
  };

  const updateUser = async (data: any) => {
    await upDateUserApi(data)
      .then((res: any) => {
        setUser(res);
        setModalUpdateUser(false);
        toast.success("Usuario atualizado com sucesso!", {
          autoClose: 900,
          theme: "dark",
        });
      })
      .catch((err) => {
        toast.error("Erro ao atualizar!", {
          autoClose: 900,
          theme: "dark",
        });
      });
  };

  const registerUser = (data: IUserRegister) => {
    const { confirm_password, ...userData } = data;
    userData.state = userData.state.toUpperCase();
    api
      .post("/register", userData)
      .then((res) => {
        toast.success("Usuário registrado com sucesso!", {
          autoClose: 900,
          theme: "dark",
        });
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Não foi possível fazer o cadastro!", {
          autoClose: 900,
          theme: "dark",
        });
      });
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        loginRoute,
        user,
        isLogged,
        loading,
        loginButton,
        setLoginButton,
        donationButton,
        setDonationButton,
        listAnimals,
        backProfile,
        adopted,
        setAdopted,
        deleteAnimal,
        modalUpdateUser,
        setModalUpdateUser,
        updateUser,
        registerUser,
        lisAnimalsUser,
        registerPet,
        setIsShowModalPet,
        isShowModalPet,
        listSupplies,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
