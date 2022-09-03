import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Error } from "../../components/ErrorValidators/styles";
import { Input, InputRadio } from "../../components/Input/style";
import { LabelForm } from "../../components/Label/style";
import registerSchema from "../../validators/registerUser";
import { ContainerForm, Form } from "../Login/styles";
import {
  BsCheckLg,
  BsEyeSlash,
  BsEye,
  BsQuestionCircle,
  BsSuitHeartFill,
} from "react-icons/bs";
import { IStatesOptions, IUserRegister } from "../../services/registerUserApi";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { statesApi } from "../../services/api";

const Register = () => {
  const [visible, setVisible] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [statesOptions, setStatesOptions] = useState<IStatesOptions[]>(
    [] as IStatesOptions[]
  );
  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserRegister>({ resolver: yupResolver(registerSchema) });

  useEffect(() => {
    statesApi.get("estados").then((res) => setStatesOptions(res.data));
  }, []);

  return (
    <ContainerForm>
      <Form onSubmit={handleSubmit(registerUser)}>
        <h1 className="form__title">Cadastro</h1>
        <div className="form__container">
          <div className="form__input">
            <LabelForm>Nome</LabelForm>
            <Input type="text" {...register("name")} />
            <Error>{errors.name?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Email</LabelForm>
            <Input type="text" {...register("email")} />
            <Error>{errors.email?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Senha</LabelForm>
            <div className="input__password">
              <Input
                placeholder="Digite aqui sua senha"
                type={visible ? "text" : "password"}
                {...register("password")}
              />
              {visible ? (
                <BsEye
                  onClick={() => setVisible(!visible)}
                  className="icon__eyes"
                />
              ) : (
                <BsEyeSlash
                  onClick={() => setVisible(!visible)}
                  className="icon__eyes"
                />
              )}
            </div>
            <Error>{errors.password?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Confirmar Senha</LabelForm>
            <div className="input__password">
              <Input
                placeholder="Digite sua senha novamente"
                type={visibleConfirm ? "text" : "password"}
                {...register("confirm_password")}
              />
              {visibleConfirm ? (
                <BsEye
                  onClick={() => setVisibleConfirm(!visibleConfirm)}
                  className="icon__eyes"
                />
              ) : (
                <BsEyeSlash
                  onClick={() => setVisibleConfirm(!visibleConfirm)}
                  className="icon__eyes"
                />
              )}
            </div>
            <Error>{errors.confirm_password?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Data de Nascimento</LabelForm>
            <Input type="date" {...register("birthday")} />
            <Error>{errors.birthday?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Estado</LabelForm>
            <select {...register("state")}>
              {statesOptions.map(({ id, sigla }) => (
                <option key={id} value={sigla}>
                  {sigla}
                </option>
              ))}
            </select>
          </div>

          <div className="form__input">
            <LabelForm>Cidade</LabelForm>
            <Input type="text" {...register("city")} />
            <Error>{errors.city?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Bairro</LabelForm>
            <Input type="text" {...register("district")} />
            <Error>{errors.district?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Tipo de cadastro</LabelForm>
            <div className="radio--inputs">
              <div className="form__input--radio">
                <InputRadio
                  type="radio"
                  id="adopt"
                  value="adopt"
                  {...register("user_type")}
                />
                <LabelForm htmlFor="adopt">Quero Adotar!</LabelForm>
              </div>

              <div className="form__input--radio">
                <InputRadio
                  type="radio"
                  id="forAdoption"
                  value="forAdoption"
                  {...register("user_type")}
                />
                <LabelForm htmlFor="forAdoption">Sou Protetor</LabelForm>

                <BsQuestionCircle className="user_type__info--question_mark" />
                <div className="user_type__info--text">
                  <p>
                    Protetores são pessoas maravilhosas que resgatam bichinhos
                    das ruas para cuidar e ajudar a achar um lar permanente para
                    eles!
                  </p>
                  <BsSuitHeartFill className="user_type__info--heart" />
                </div>
              </div>
            </div>
            <Error>{errors.user_type?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Foto de Perfil</LabelForm>
            <Input type="url" {...register("picture")} />
            <Error>{errors.picture?.message}</Error>
          </div>

          <div className="form__input">
            <LabelForm>Sobre você</LabelForm>
            <Input type="text" {...register("bio")} />
            <Error>{errors.bio?.message}</Error>
          </div>
        </div>

        <button type="submit" className="form__button">
          <BsCheckLg />
        </button>
        <div className="form__footer">
          <p className="footer__text">Já possui conta?</p>
          <Link to="/login" className="form__link">
            Faça o login
          </Link>
        </div>
      </Form>
    </ContainerForm>
  );
};

export default Register;