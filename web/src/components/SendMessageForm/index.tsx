import { FormEvent, useContext, useEffect, useState } from "react";
import { VscGithubInverted, VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

export function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [sucess, setSucess] = useState(false);

  async function handleSendMessagee(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    await api.post("messages", { message });

    setSucess(true);
    setMessage("");
  }

  useEffect(() => {
    setTimeout(() => {
      setSucess(false);
    }, 10000);
  }, [sucess]);

  return (
    <div className={styles.sendMessageFormWrapper}>
      <div className={`${sucess ? styles.sucessMessage : styles.false}`}>
        {sucess ? "Mensagem enviada com sucesso!" : ""}
      </div>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}> {user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size="16" />
          {user?.login}
        </span>
      </header>

      <form className={styles.sendMessageForm} onSubmit={handleSendMessagee}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          name="message"
          id="message"
          placeholder="Qual sua expectativa para o evento"
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <button type="submit">Enviar Mensagem</button>
      </form>
    </div>
  );
}
