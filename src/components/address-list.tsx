import { deleteAddressAction, setDefaultAddressAction } from "@/app/actions/address";
import { AddressForm } from "@/components/address-form";

type AddressItem = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  detail: string;
  isDefault: boolean;
};

function AddressCard({ address }: { address: AddressItem }) {
  return (
    <div className="card-sh">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold uppercase tracking-widest">{address.label}</span>
          {address.isDefault ? (
            <span className="border border-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent">Utama</span>
          ) : null}
        </div>
        <div className="flex gap-4 text-[11px] font-bold uppercase tracking-widest">
          {!address.isDefault ? (
            <form action={setDefaultAddressAction}>
              <input type="hidden" name="id" value={address.id} />
              <button type="submit" className="text-muted hover:text-accent">Jadikan Utama</button>
            </form>
          ) : null}
          <form action={deleteAddressAction}>
            <input type="hidden" name="id" value={address.id} />
            <button type="submit" className="text-muted hover:text-accent">Hapus</button>
          </form>
        </div>
      </div>
      <div className="p-5 text-sm leading-relaxed text-muted">
        <p className="font-semibold text-paper">{address.recipient}</p>
        <p>{address.phone}</p>
        <p>{address.detail}</p>
        <p>{address.district}, {address.city}, {address.province} {address.postalCode}</p>
      </div>
      <div className="border-t border-line px-5 py-2">
        <AddressForm address={address} />
      </div>
    </div>
  );
}

export function AddressList({ addresses }: { addresses: AddressItem[] }) {
  if (addresses.length === 0) {
    return <p className="card-sh p-8 text-center text-sm text-muted">Belum ada alamat tersimpan. Tambahkan alamat pertamamu.</p>;
  }
  return (
    <div className="space-y-4">
      {addresses.map((address) => <AddressCard key={address.id} address={address} />)}
    </div>
  );
}
