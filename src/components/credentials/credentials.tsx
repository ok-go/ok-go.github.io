import './credentials.css'

export function Credentials(props: { withLogo: boolean }) {
  return (
    <>
      {props.withLogo ? <Logo /> : <Footer />}
    </>
  )
}

function Footer() {
  return (
    <div class='cred-footer'>
      L'Arch by Gordienko, 2024
    </div>
  )
}

function Logo() {
  return (
    <div class='cred-logo'>
      <div id='name'>L'Arch</div>
      <div id='creator'>BY GORDIENKO</div>
    </div>
  )
}
